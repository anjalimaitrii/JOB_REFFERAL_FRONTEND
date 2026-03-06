const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PostAuthor {
    _id: string;
    name: string;
    profilePhoto?: string;
    designation: string;
}

export interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
        profilePhoto?: string;
    };
    content: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    employee: PostAuthor;
    company: {
        _id: string;
        name: string;
        logo?: string;
        jobs?: {
            _id: string;
            title: string;
        }[];
    };
    content: string;
    image?: string;
    likes: string[];
    comments: Comment[];
    isFollowing?: boolean;
    createdAt: string;
    updatedAt: string;
}

/* Create a new post (Employees only) */
export const createPost = async (content: string, image?: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, image }),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to create post");
    }

    return result;
};


/* Get explore feed (random/recent posts) */
export const getExploreFeed = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/explore`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch explore feed");
    }

    return res.json();
};

/* Get following feed (posts from companies followed by student) */
export const getFollowingFeed = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/following`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch following feed");
    }

    return res.json();
};

/* Get current employee's company posts (or any specific company) */
export const getCompanyPosts = async (companyId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/company/${companyId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch company posts");
    }

    return res.json();
};

/* Toggle like on a post */
export const likePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/like/${postId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to toggle like");
    }

    return res.json();
};

/* Add comment to a post */
export const addComment = async (postId: string, content: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/comment/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        throw new Error("Failed to add comment");
    }

    return res.json();
};

export const deletePost = async (postId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete post");
    }

    return res.json();
};



export const updatePost = async (postId: string, content: string, image?: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, image }),
    });

    if (!res.ok) {
        throw new Error("Failed to update post");
    }

    return res.json();
};

export const reportPost = async (postId: string, reason: string) => {

    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/posts/report/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason })
    });
    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message);
    }

    return result;
};