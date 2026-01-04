// Supabase Configuration
const supabaseUrl = 'https://inobbejethxftzrplmcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2JiZWpldGh4ZnR6cnBsbWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDI1ODAsImV4cCI6MjA4MzA3ODU4MH0.OCOzsimGatNoOpg4cXMH16_kMci6PYSljKF-CR12CCc';
const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

// UI State
let currentView = 'all'; // 'all' or 'mine'

document.addEventListener('DOMContentLoaded', async () => {
    console.log('PostApp UI Loaded');

    // Check User Session
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const user = session.user;
    const fullName = user.user_metadata.full_name || 'User';
    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    // Update Profile UI
    document.getElementById('userEmailDisplay').innerText = user.email;
    const avatarEl = document.getElementById('userInitialAvatar');
    if (avatarEl) avatarEl.innerText = initials;

    // Handle Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await _supabase.auth.signOut();
            if (error) {
                alert('Logout error: ' + error.message);
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Navigation Links
    const homeLink = document.getElementById('homeLink');
    const myPostsLink = document.getElementById('myPostsLink');

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentView = 'all';
        homeLink.classList.add('active');
        myPostsLink.classList.remove('active');
        fetchPosts();
    });

    myPostsLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentView = 'mine';
        myPostsLink.classList.add('active');
        homeLink.classList.remove('active');
        fetchPosts();
    });

    // Initial Fetch
    fetchPosts();

    // Handle Create Post Form
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.querySelector('button[type="submit"][form="createPostForm"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Publishing...';
            }

            const title = createPostForm.querySelector('input[name="title"]').value;
            const content = createPostForm.querySelector('textarea[name="content"]').value;
            const file = createPostForm.querySelector('input[name="image"]').files[0];

            try {
                let imageUrl = '';
                if (file) {
                    const fileName = `${Date.now()}-${file.name}`;
                    const { data: uploadData, error: uploadError } = await _supabase.storage
                        .from('post-image')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = _supabase.storage
                        .from('post-image')
                        .getPublicUrl(fileName);

                    imageUrl = publicUrl;
                }

                console.log('Inserting post into DB...');
                const postData = {
                    title,
                    content,
                    image_url: imageUrl,
                    author_id: user.id,
                    author_name: fullName
                };
                console.log('Post Data being sent:', postData);
                console.log('Current Auth UID:', user.id);

                const { error: insertError } = await _supabase
                    .from('posts')
                    .insert([postData]);

                if (insertError) {
                    console.error('DB Insert Error:', insertError);
                    throw insertError;
                }

                alert('Post published successfully!');
                createPostForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
                if (modal) modal.hide();
                fetchPosts();
            } catch (err) {
                alert('Error publishing post: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Publish Post';
            }
        });
    }

    // Handle Edit Post Form
    const editPostForm = document.getElementById('editPostForm');
    if (editPostForm) {
        editPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.querySelector('button[type="submit"][form="editPostForm"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
            }

            const id = document.getElementById('editPostId').value;
            const title = document.getElementById('editPostTitle').value;
            const content = document.getElementById('editPostContent').value;

            try {
                const { error } = await _supabase
                    .from('posts')
                    .update({ title, content })
                    .eq('id', id);

                if (error) throw error;

                alert('Post updated successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
                if (modal) modal.hide();
                fetchPosts();
            } catch (err) {
                alert('Error updating post: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Save Changes';
            }
        });
    }
});

async function fetchPosts() {
    const postsGrid = document.getElementById('postsGrid');
    const titleEl = document.getElementById('feedTitle');
    const subtitleEl = document.getElementById('feedSubtitle');

    postsGrid.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-primary"></div></div>';

    const { data: { session } } = await _supabase.auth.getSession();
    const currentUser = session ? session.user : null;

    let query = _supabase.from('posts').select('*');

    if (currentView === 'mine' && currentUser) {
        query = query.eq('author_id', currentUser.id);
        titleEl.innerText = 'My Posts';
        subtitleEl.innerText = 'Manage your published community stories';
    } else {
        titleEl.innerText = 'Community Feed';
        subtitleEl.innerText = 'Explore the latest blog posts from our community';
    }

    const { data: posts, error } = await query.order('created_at', { ascending: false });

    if (error) {
        postsGrid.innerHTML = `<div class="alert alert-danger">Error loading posts: ${error.message}</div>`;
        return;
    }

    if (!posts || posts.length === 0) {
        if (currentView === 'all') {
            renderDummyPosts(postsGrid);
        } else {
            postsGrid.innerHTML = '<div class="text-center w-100 py-5 text-muted">No posts found by you yet.</div>';
        }
        return;
    }

    postsGrid.innerHTML = '';
    posts.forEach((post, index) => {
        renderPostCard(postsGrid, post, index, currentUser);
    });
}

function renderPostCard(container, post, index, currentUser) {
    const date = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const authorInitials = (post.author_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const isAuthor = currentUser && currentUser.id === post.author_id;

    const authorActions = isAuthor ? `
        <div class="d-flex gap-2 mt-2">
            <button class="btn btn-dark btn-sm flex-grow-1" onclick="openEditModal('${post.id}', '${post.title.replace(/'/g, "\\'")}', '${post.content.replace(/'/g, "\\'")}')">Edit</button>
            <button class="btn btn-outline-danger btn-sm" onclick="deletePost('${post.id}')"><i class="bi bi-trash"></i></button>
        </div>
    ` : '';

    const card = `
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: ${index * 0.1}s;">
            <article class="post-card card h-100">
                <div class="card-img-container">
                    <img src="${post.image_url || 'https://via.placeholder.com/800x450?text=No+Image'}" class="card-img-top" alt="${post.title}">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="post-meta">
                        <span class="author-chip">
                            <div class="author-avatar">${authorInitials}</div>
                            By ${post.author_name || 'Anonymous'}
                        </span>
                        <span>• ${date}</span>
                    </div>
                    <h5 class="post-title">${post.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                    <button class="btn btn-outline-dark btn-sm w-100 mt-3 rounded-pill" onclick="alert('Full post:\\n\\n${post.content.replace(/'/g, "\\'")}')">Read More</button>
                    ${authorActions}
                </div>
            </article>
        </div>
    `;
    container.innerHTML += card;
}

function renderDummyPosts(container) {
    const dummyData = [
        {
            title: "Exploring the Future of Tech",
            author_name: "Tech Geek",
            created_at: new Date().toISOString(),
            content: "Artificial Intelligence and Machine Learning are reshaping the world as we know it. From automation to creative arts...",
            image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "The Art of Sustainable Living",
            author_name: "Eco Warrior",
            created_at: new Date().toISOString(),
            content: "Living sustainably is more than just a trend—it's a lifestyle. Discover how small changes can make a big impact on our planet...",
            image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Mastering the Craft of Cooking",
            author_name: "Chef Special",
            created_at: new Date().toISOString(),
            content: "Cooking is a journey of flavors. Learn the secret tips from top chefs to elevate your everyday meals to gourmet levels...",
            image_url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=800&q=80"
        }
    ];

    container.innerHTML = '';
    dummyData.forEach((post, index) => {
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const authorInitials = post.author_name.split(' ').map(n => n[0]).join('').toUpperCase();

        const card = `
            <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <article class="post-card card h-100 border-primary shadow-sm">
                    <div class="card-img-container">
                        <span class="badge bg-primary position-absolute m-3" style="z-index: 2;">Featured</span>
                        <img src="${post.image_url}" class="card-img-top" alt="${post.title}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="post-meta">
                            <span class="author-chip">
                                <div class="author-avatar">${authorInitials}</div>
                                By ${post.author_name}
                            </span>
                            <span>• ${date}</span>
                        </div>
                        <h5 class="post-title">${post.title}</h5>
                        <p class="card-text text-muted small flex-grow-1">${post.content}</p>
                        <button class="btn btn-outline-primary btn-sm w-100 mt-3 rounded-pill" onclick="alert('This is a demo post!')">Read More</button>
                    </div>
                </article>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Global functions for inline onclicks
window.openEditModal = (id, title, content) => {
    document.getElementById('editPostId').value = id;
    document.getElementById('editPostTitle').value = title;
    document.getElementById('editPostContent').value = content;
    const modal = new bootstrap.Modal(document.getElementById('editPostModal'));
    modal.show();
};

window.deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        const { error } = await _supabase.from('posts').delete().eq('id', postId);
        if (error) throw error;
        alert('Post deleted successfully!');
        fetchPosts();
    } catch (err) {
        alert('Error deleting post: ' + err.message);
    }
};
