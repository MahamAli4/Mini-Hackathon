// Supabase Configuration
const supabaseUrl = 'https://inobbejethxftzrplmcs.supabase.co';
const supabaseKey = 'sb_publishable_ZnZB7VuIDg9eKeZyZN-x-A_IhMkQ6AH';
const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('PostApp UI Loaded');

    // Check User Session
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // Display User Details
    const user = session.user;
    document.getElementById('userEmailDisplay').innerText = user.email;
    document.getElementById('userName').innerText = user.user_metadata.full_name || 'User';

    // Fetch and Display Posts
    fetchPosts();

    // Handle Create Post Form
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = createPostForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Publishing...';

            const title = createPostForm.querySelector('input[type="text"]').value;
            const content = createPostForm.querySelector('textarea').value;
            const file = createPostForm.querySelector('input[type="file"]').files[0];

            try {
                let imageUrl = '';
                if (file) {
                    const fileName = `${Date.now()}-${file.name}`;
                    const { data: uploadData, error: uploadError } = await _supabase.storage
                        .from('post-images')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = _supabase.storage
                        .from('post-images')
                        .getPublicUrl(fileName);

                    imageUrl = publicUrl;
                }

                const { error: insertError } = await _supabase
                    .from('posts')
                    .insert([{
                        title,
                        content,
                        image_url: imageUrl,
                        author_id: user.id,
                        author_name: user.user_metadata.full_name || 'Anonymous'
                    }]);

                if (insertError) throw insertError;

                alert('Post published successfully!');
                createPostForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
                modal.hide();
                fetchPosts(); // Refresh grid
            } catch (err) {
                alert('Error publishing post: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Publish Post';
            }
        });
    }
});

async function fetchPosts() {
    const postsGrid = document.getElementById('postsGrid');
    postsGrid.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-primary"></div></div>';

    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        postsGrid.innerHTML = `<div class="alert alert-danger">Error loading posts: ${error.message}</div>`;
        return;
    }

    if (!posts || posts.length === 0) {
        postsGrid.innerHTML = '<div class="text-center w-100 py-5 text-muted">No posts yet. Be the first to share something!</div>';
        return;
    }

    postsGrid.innerHTML = '';
    posts.forEach((post, index) => {
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        const authorInitials = (post.author_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        const card = `
            <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: ${index * 0.1}s;">
                <article class="post-card card">
                    <div class="card-img-container">
                        <img src="${post.image_url || 'https://via.placeholder.com/800x450?text=No+Image'}" class="card-img-top" alt="${post.title}">
                    </div>
                    <div class="card-body">
                        <div class="post-meta">
                            <span class="author-chip">
                                <div class="author-avatar">${authorInitials}</div>
                                By ${post.author_name || 'Anonymous'}
                            </span>
                            <span>• ${date}</span>
                        </div>
                        <h5 class="post-title">${post.title}</h5>
                        <p class="card-text text-muted small">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                        <button class="btn btn-outline-dark btn-sm w-100 mt-3 rounded-pill" onclick="alert('Full post text: \\n\\n${post.content.replace(/'/g, "\\'")}')">Read More</button>
                    </div>
                </article>
            </div>
        `;
        postsGrid.innerHTML += card;
    });
}
