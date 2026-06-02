// ZippyKart Database Connection
const firebaseConfig = {
    apiKey: "AIzaSyCTPYITHNUzAWLdMXx9zraOJxyEp4mnXpk",
    authDomain: "zippykart-production-157e1.firebaseapp.com",
    projectId: "zippykart-production-157e1",
    storageBucket: "zippykart-production-157e1.appspot.com",
    messagingSenderId: "803651431969",
    appId: "1:803651431969:web:7432f351ec9f5f0ec23d60",
    measurementId: "G-7ZJQQTZE1C"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function() {
    // Ye aapke products wale grid ko dhoondhega (yahan aapke screenshot ke hissab se generic selector use kiya hai)
    const grid = document.querySelector('.pro-container') || document.querySelector('.product-grid') || document.querySelector('.row') || document.querySelector('div[style*="display: grid"]');
    
    if (grid) {
        db.collection("zippykart_products").orderBy("timestamp", "asc").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                
                // Screenshot wale design jaisa ek naya card banana
                const card = document.createElement('div');
                card.style.border = "1px solid #eee";
                card.style.borderRadius = "8px";
                card.style.padding = "10px";
                card.style.textAlign = "center";
                card.style.background = "#fff";
                
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" style="width:100%; height:200px; object-fit:cover; border-radius:5px;">
                    <h5 style="margin:12px 0 5px 0; font-size:14px; font-weight:bold; color:#333;">${product.title}</h5>
                    <p style="color:#ff4b4b; font-weight:bold; margin-bottom:12px; font-size:16px;">₹${product.price}</p>
                    <button style="background:black; color:white; padding:8px; width:100%; border:none; border-radius:4px; margin-bottom:8px; font-weight:bold; cursor:pointer;">Add to Cart</button>
                    <button style="background:#ff4b4b; color:white; padding:8px; width:100%; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Buy Now</button>
                `;
                
                // Naye product ko list mein sabse aage (first) lagana
                grid.prepend(card);
            });
        }).catch((error) => {
            console.error("Firebase connection error: ", error);
        });
    }
});
