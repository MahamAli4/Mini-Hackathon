// Supabase Configuration
const supabaseUrl = 'https://inobbejethxftzrplmcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2JiZWpldGh4ZnR6cnBsbWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDI1ODAsImV4cCI6MjA4MzA3ODU4MH0.OCOzsimGatNoOpg4cXMH16_kMci6PYSljKF-CR12CCc';
const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = 'index.html';
        return;
    }

    // Check session
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    fetchPostDetails(postId);
});

async function fetchPostDetails(id) {
    const container = document.getElementById('postDetailContainer');

    try {
        // Fetch post from Supabase
        const { data: post, error } = await _supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Check if it's one of our dummy posts
            if (id.startsWith('demo-')) {
                renderDummyDetail(id, container);
                return;
            }
            throw error;
        }

        renderDetails(container, post);
    } catch (err) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4 class="alert-heading">Post Not Found</h4>
                <p>${err.message}</p>
                <hr>
                <a href="index.html" class="btn btn-outline-danger">Return to Home</a>
            </div>
        `;
    }
}

function renderDetails(container, post) {
    const date = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const authorInitials = (post.author_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    container.innerHTML = `
        <div class="detail-card">
            <div class="detail-img-container">
                <img src="${post.image_url || 'https://via.placeholder.com/1200x600?text=No+Image'}" class="detail-img" alt="${post.title}">
            </div>
            <div class="detail-content">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <span class="author-chip">
                        <div class="author-avatar">${authorInitials}</div>
                        By ${post.author_name || 'Anonymous'}
                    </span>
                    <span class="text-muted">• ${date}</span>
                </div>
                <h1 class="fw-bold mb-4">${post.title}</h1>
                <div class="fs-5 text-secondary leading-relaxed" style="white-space: pre-wrap;">
                    ${post.content}
                </div>
            </div>
        </div>
    `;
}

function renderDummyDetail(id, container) {
    // This handles the dummy posts if clicked
    const dummyData = {
        'demo-0': {
            title: "Exploring the Future of Tech",
            author_name: "Tech Geek",
            created_at: new Date().toISOString(),
            content: "Artificial Intelligence and Machine Learning are reshaping the world as we know it. From automation to creative arts, the impact is undeniable. We are witnessing a shift where machines not only assist but also innovate, creating new possibilities for humanity.\n\nKey areas of impact include:\n1. Personalization of Services\n2. Advanced Data Processing\n3. Breakthroughs in Healthcare Diagnosis\n\nAs we move forward, the ethical considerations will be just as important as the technological ones.",
            image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
        },
        'demo-1': {
            title: "The Art of Sustainable Living",
            author_name: "Eco Warrior",
            created_at: new Date().toISOString(),
            content: "Living sustainably is more than just a trend—it's a lifestyle. Discover how small changes can make a big impact on our planet. From reducing plastic use to conscious consumption, every action counts.\n\nHow to get started:\n- Switch to reusable bags and bottles.\n- Support local farmers and ethical brands.\n- Reduce your carbon footprint by opting for public transport or cycling.\n\nNature is our home, and it's time we treat it with respect.",
            image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
        },
        'demo-2': {
            title: "Mastering the Craft of Cooking",
            author_name: "Chef Special",
            created_at: new Date().toISOString(),
            content: "Cooking is a journey of flavors. Learn the secret tips from top chefs to elevate your everyday meals to gourmet levels. It starts with the freshest ingredients and ends with your own personal touch.\n\nChef's advice:\n- Don't be afraid to experiment with spices.\n- Perfection comes with practice.\n- Always taste as you go!\n\nA meal made with passion is a meal that inspires.",
            image_url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80"
        }
    };

    const post = dummyData[id];
    if (post) {
        renderDetails(container, post);
    }
}
