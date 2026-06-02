// ZippyKart Database Connection
const firebaseConfig = {
    apiKey: "AIzaSyCTPYITHNUzAWLdMXx9zraOJxyEp4mnXpk",
    authDomain: "zippykart-production-157e1.firebaseapp.com",
    projectId: "zippykart-production-157e1",
    storageBucket: "zippykart-production-157e1.appspot.com",
    messagingSenderId: "803651431969",
    appId: "1:803651431969:web:7432f351ec9f5f0ec23d60",
    measurementId: "G-7ZJQQQTZE1C"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Fetch Products and Display on Homepage
document.addEventListener("DOMContentLoaded", function() {
    const grid = document.querySelector('.pro-container');

    if (grid) {
        grid.innerHTML = ""; // Purana static kachra saaf karne ke liye
        
        db.collection("zippykart_products").orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productId = doc.id; // Sabse Zaroori: Product ki Unique ID
                
                const mrpText = product.mrp ? `<del style="color:#999; font-size:12px; font-weight:normal; margin-left:5px;">₹${product.mrp}</del>` : "";

                const card = document.createElement('div');
                card.style.border = "1px solid #eee";
                card.style.borderRadius = "8px";
                card.style.padding = "10px";
                card.style.textAlign = "center";
                card.style.background = "#fff";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.justifyContent = "space-between";
                card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                card.style.cursor = "pointer";

                // Yahan onClick lagaya hai image aur text par
                card.innerHTML = `
                    <div onclick="window.location.href='product.html?id=${productId}'" style="text-decoration:none; color:inherit;">
                        <img src="${product.image}" alt="${product.title}" style="width:100%; border-radius:8px; aspect-ratio: 1/1; object-fit: cover;">
                        <h5 style="margin:12px 0 5px 0; font-size: 14px; font-weight:600; color: #333; line-height:1.4;">${product.title}</h5>
                        <p style="color:#ff4b4b; font-weight:700; font-size:16px; margin-bottom: 12px;">₹${product.price} ${mrpText}</p>
                    </div>
                    
                    <div style="display:flex; gap:8px; flex-direction:column;">
                        <button onclick="addToCart('${productId}', '${product.title}', ${product.price}, '${product.image}')" style="background:black; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer; font-weight:600; transition:0.3s;">Add to Cart</button>
                        <button onclick="window.location.href='checkout.html?id=${productId}'" style="background:#ff4b4b; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer; font-weight:600;">Buy Now</button>
                    </div>
                `;
                
                grid.appendChild(card);
            });
        })
        .catch((error) => {
            console.log("Error getting products: ", error);
        });
    }
});

// Add to Cart Function (Local Storage mein save karne ke liye)
window.addToCart = function(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem('zippyCart')) || [];
    
    // Check if product already in cart
    let existingProduct = cart.find(item => item.id === id);
    if(existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: id, title: title, price: price, image: image, quantity: 1 });
    }
    
    localStorage.setItem('zippyCart', JSON.stringify(cart));
    
    alert(title + " Cart mein add ho gaya! 🛒");
};
