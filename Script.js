let appCartMemory = [];
let selectedReviewRating = 5;
let currentActiveProductId = null;
let reviewPhotoBase64 = "";
let authCurrentModalState = "login";
let sessionActiveLoggedInUser = null;

const databaseProducts = [
    { id: "fw_sneaker_1", category: "footwear", title: "Luxury White Air Sneakers", price: 1999, oldPrice: 4999, off: "60%", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500", specs: "High-grade leather compilation framework. Shockproof responsive sole architecture configured for elite street aesthetics and sporting operations." },
    { id: "fw_sleeper_1", category: "footwear", title: "Comfort Cloud Home Sleepers", price: 399, oldPrice: 999, off: "60%", img: "https://images.unsplash.com/photo-1603487742131-4160ec99930a?q=80&w=500", specs: "Lightweight premium EVA structural composition matrix. Enhanced non-slip tread textures optimize indoor grip patterns perfectly." },
    { id: "fw_loafer_1", category: "footwear", title: "Suede Tan Classic Loafers", price: 1499, oldPrice: 2999, off: "50%", img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=500", specs: "Genuine Italian tan soft suede outer layer setup. Ergonomic slip-on chassis structure lined with velvet sweat absorption padding nodes." },
    { id: "fw_lowprice_1", category: "footwear", title: "Daily Run Budget Active Shoes", price: 699, oldPrice: 1499, off: "53%", img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=500", specs: "High flexibility mesh web fabric configurations. Economical running drop layout ensuring smooth stability parameters for track routines." },
    { id: "cl_tshirt_1", category: "tshirt", title: "Oversized Maroon Culture Tee", price: 799, oldPrice: 1499, off: "46%", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500", specs: "Heavy 240 GSM pre-shrunk organic cotton combed locks. Oversized vintage styling architecture engineered custom for heavy streetwear statements." },
    { id: "cl_cargo_1", category: "cargo", title: "Baggy Multi-Pocket Utility Cargos", price: 1299, oldPrice: 2499, off: "48%", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500", specs: "Tear-resistant canvas build frame. Integrated 6-pocket heavy layout system configurations engineered for loose rugged apparel matches." },
    { id: "cos_lip_1", category: "cosmetic", title: "Velvet Matte Liquid Lipstick", price: 499, oldPrice: 999, off: "50%", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500", specs: "Waterproof rich pigment fluid base layers. Intense nourishment complex locks comfort while sealing surface maps from smudge lines." },
    { id: "toy_blocks_1", category: "toys", title: "Organic Alphabet Wooden Blocks Set", price: 799, oldPrice: 1499, off: "46%", img: "https://images.unsplash.com/photo-1515488042361-404e9250afef?q=80&w=500", specs: "Natural chemical-free pinewood pieces. Smooth polished geometry vertices for hazard-free child coordination and spatial logic tracking loops." },
    { id: "bg_tote_1", category: "bags", title: "Classic Pastel Leather Hand Tote Bag", price: 599, oldPrice: 1499, off: "60%", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500", specs: "High-luxury pastel surface overlay mapping. Reinforced continuous chain link hardware clips with premium scratch shielding." }
];

let simulatedDatabaseReviews = {
    "fw_sneaker_1": [{ stars: 5, msg: "Insane comfort sole block! Fits perfectly.", photo: "" }]
};

function initializeStoreCatalog() {
    const container = document.getElementById('catalogProductsGrid');
    if (!container) return;
    container.innerHTML = "";
    databaseProducts.forEach(item => {
        container.innerHTML += `
            <div class="card product-card" data-category="${item.category}" onclick="openProductDetailModal('${item.id}')">
                <div class="img-container"><img src="${item.img}"></div>
                <h3>${item.title}</h3>
                <div class="price-box"><span class="now">₹${item.price}</span><span class="old">₹${item.oldPrice}</span><span class="off">(${item.off} OFF)</span></div>
                <button class="buy-btn" onclick="event.stopPropagation(); pushToBasket('${item.title}', ${item.price})">Add To Cart</button>
            </div>
        `;
    });
    renderGoogleGsiEmbeddedButton();
}
window.addEventListener('DOMContentLoaded', initializeStoreCatalog);

let slideIdx = 0;
setInterval(() => {
    slideIdx = (slideIdx + 1) % 5;
    const engine = document.getElementById('heroSliderEngine');
    if(engine) engine.style.transform = `translateX(-${slideIdx * 100}vw)`;
}, 3600);

function filterCategory(tag, btnEl) {
    if(btnEl) {
        document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
        btnEl.classList.add('active');
    }
    document.querySelectorAll('.product-card').forEach(card => {
        if(tag === 'all' || card.getAttribute('data-category') === tag) card.style.display = "flex";
        else card.style.display = "none";
    });
}

function filterCategoryBySlider(tag) {
    filterCategory(tag, null);
    document.querySelectorAll('.cat-item').forEach(i => {
        if(i.getAttribute('onclick').includes(`'${tag}'`)) i.classList.add('active');
        else i.classList.remove('active');
    });
    document.getElementById('catalogProductsGrid').scrollIntoView({ behavior: 'smooth' });
}

function triggerCustomModalPopup(title, body) {
    document.getElementById('popupModalTitleNode').innerText = title;
    document.getElementById('popupModalBodyNode').innerText = body;
    document.getElementById('masterAppPopupModal').style.display = "flex";
}
function closeAppCustomPopup() { document.getElementById('masterAppPopupModal').style.display = "none"; }
function handleToggleSwitchMotion(cb) {
    const lbl = document.getElementById('toggleStatusLabel');
    lbl.innerText = cb.checked ? "Enabled" : "Disabled";
    lbl.style.color = cb.checked ? "#ff3e3e" : "#888";
}

function openAuthGatewayModal() {
    if(sessionActiveLoggedInUser) return;
    document.getElementById('zippyAuthMasterGatewayModal').style.display = "flex";
    toggleAuthModalState('login');
}
function closeAuthGatewayModal() { document.getElementById('zippyAuthMasterGatewayModal').style.display = "none"; }

function toggleAuthModalState(state) {
    authCurrentModalState = state;
    const headingNode = document.getElementById('authModalLeftHeading');
    const subheadingNode = document.getElementById('authModalLeftSubheading');
    const promptRow = document.getElementById('authSwitchPromptMessageRow');
    const fieldsContainer = document.getElementById('authFormDynamicFieldsContainer');
    const submitBtn = document.getElementById('authActionSubmitButtonElement');
    fieldsContainer.innerHTML = "";

    if(state === 'login') {
        headingNode.innerText = "Login";
        subheadingNode.innerText = "Get access to your Orders, Wishlist collection and customized tracking data logs tree seamlessly.";
        promptRow.innerHTML = `New to ZippyKart? <span class="blue-link-trigger" onclick="toggleAuthModalState('register')">Create Registration</span>`;
        submitBtn.innerText = "Log In Account";
        fieldsContainer.innerHTML = `
            <div class="auth-input-cell"><label>Email ID / Username</label><input type="email" id="authEmailNodeField" placeholder="Enter Email Address"></div>
            <div class="auth-input-cell"><label>Password</label><input type="password" id="authPasswordNodeField" placeholder="Enter Password"></div>
        `;
    } else if(state === 'register') {
        headingNode.innerText = "Register";
        subheadingNode.innerText = "Sign up with your structural parameters to initialize your personal checkout storage cluster node.";
        promptRow.innerHTML = `Already have an account? <span class="blue-link-trigger" onclick="toggleAuthModalState('login')">Log In</span>`;
        submitBtn.innerText = "Create Account";
        fieldsContainer.innerHTML = `
            <div class="auth-input-cell"><label>First Name</label><input type="text" id="regFirstNameField" placeholder="e.g. Akash"></div>
            <div class="auth-input-cell"><label>Last Name</label><input type="text" id="regLastNameField" placeholder="e.g. Kumar"></div>
            <div class="auth-input-cell"><label>Mobile Number</label><input type="tel" id="regMobileNumberField" placeholder="10-digit smartphone coordinate"></div>
            <div class="auth-input-cell"><label>Gmail ID</label><input type="email" id="regEmailAddressField" placeholder="user@gmail.com"></div>
            <div class="auth-input-cell"><label>Create Password</label><input type="password" id="regCreatePasswordField" placeholder="Secure cipher key"></div>
        `;
    }
}

function handleAuthFormSubmission() {
    if(authCurrentModalState === 'login') {
        const mail = document.getElementById('authEmailNodeField').value.trim();
        if(!mail) { alert("Please fill standard credential streams!"); return; }
        executeCustomUserLoginInjection(mail.split('@')[0], mail);
    } else {
        const fName = document.getElementById('regFirstNameField').value.trim();
        const lName = document.getElementById('regLastNameField').value.trim();
        const mobile = document.getElementById('regMobileNumberField').value.trim();
        const mail = document.getElementById('regEmailAddressField').value.trim();
        if(!fName || !mobile || !mail) { alert("All parameters are completely compulsory!"); return; }
        if(window.firebaseDb) {
            const cleanKey = mail.replace(/[^a-zA-Z0-9]/g, "_");
            window.dbSet(window.dbRef(window.firebaseDb, 'users/' + cleanKey + '/profile'), { firstName: fName, lastName: lName, mobileHandle: mobile, emailAddress: mail, timestamp: Date.now() });
        }
        executeCustomUserLoginInjection(fName, mail);
    }
}

function executeCustomUserLoginInjection(displayName, email) {
    sessionActiveLoggedInUser = { name: displayName, email: email };
    document.getElementById('navUserBadgeName').innerHTML = `<i class="fa-solid fa-user-circle"></i> Hi, ${displayName} 👋`;
    document.getElementById('dropFullnameNode').innerText = displayName;
    document.getElementById('dropEmailNode').innerText = email;
    closeAuthGatewayModal();
    triggerCustomModalPopup('Secure Entry Success', `🎉 Welcome back ${displayName}! Session authenticated safely.`);
}

function executeLogoutSession() { sessionActiveLoggedInUser = null; window.location.reload(); }

function renderGoogleGsiEmbeddedButton() {
    setTimeout(() => {
        if(window.google) {
            google.accounts.id.initialize({ client_id: "1072191317628-1dm52tfrccuo7okcmus1rnfa2bg2584i.apps.googleusercontent.com", callback: handleCredentialResponse });
            google.accounts.id.renderButton(document.getElementById("embed-google-signin-btn-hook"), { theme: "dark", size: "medium", type: "standard", shape: "pill" });
        }
    }, 1000);
}

function handleCredentialResponse(res) {
    const token = parseJwt(res.credential);
    executeCustomUserLoginInjection(token.name.split(' ')[0], token.email);
}

function openProductDetailModal(id) {
    currentActiveProductId = id;
    const item = databaseProducts.find(p => p.id === id);
    if(!item) return;
    document.getElementById('modalProductImage').src = item.img;
    document.getElementById('modalProductTitle').innerText = item.title;
    document.getElementById('modalProductPrice').innerText = `₹${item.price}`;
    document.getElementById('modalProductSpecs').innerText = item.specs;
    document.getElementById('modalAddToCartBtn').setAttribute('onclick', `pushToBasket('${item.title}', ${item.price})`);
    setReviewStars(5);
    document.getElementById('reviewTextMessage').value = "";
    document.getElementById('reviewPhotoAttachment').value = "";
    document.getElementById('reviewPhotoPreview').style.display = "none";
    reviewPhotoBase64 = "";
    renderReviews(id);
    document.getElementById('productDetailMasterModal').style.display = "flex";
}
function closeProductDetailModal() { document.getElementById('productDetailMasterModal').style.display = "none"; }

function setReviewStars(v) {
    selectedReviewRating = v;
    document.querySelectorAll('#starInputRow i').forEach(s => {
        let rating = parseInt(s.getAttribute('data-rating'));
        s.className = rating <= v ? "fa-solid fa-star active" : "fa-solid fa-star";
    });
}

function previewReviewImage(input) {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        reviewPhotoBase64 = e.target.result;
        const node = document.getElementById('reviewPhotoPreview');
        node.src = reviewPhotoBase64;
        node.style.display = "block";
    };
    reader.readAsDataURL(file);
}

function submitProductReview() {
    const msg = document.getElementById('reviewTextMessage').value.trim();
    if(!msg) { alert("Please input review spec text parameter nodes!"); return; }
    let newReview = { stars: selectedReviewRating, msg: msg, photo: reviewPhotoBase64 };
    if(!simulatedDatabaseReviews[currentActiveProductId]) simulatedDatabaseReviews[currentActiveProductId] = [];
    simulatedDatabaseReviews[currentActiveProductId].unshift(newReview);
    if(window.firebaseDb) {
        const cleanUserKey = sessionActiveLoggedInUser ? sessionActiveLoggedInUser.email.replace(/[^a-zA-Z0-9]/g, "_") : "anonymous_user";
        window.dbSet(window.dbRef(window.firebaseDb, 'reviews/' + currentActiveProductId + '/' + cleanUserKey), { ...newReview, time: Date.now() });
    }
    renderReviews(currentActiveProductId);
    document.getElementById('reviewTextMessage').value = "";
    document.getElementById('reviewPhotoPreview').style.display = "none";
    reviewPhotoBase64 = "";
    triggerCustomModalPopup('Rating Saved', '🌟 Review successfully attached.');
}

function renderReviews(id) {
    const container = document.getElementById('productLiveReviewsContainer');
    container.innerHTML = "";
    let list = simulatedDatabaseReviews[id] || [];
    if(list.length === 0) { container.innerHTML = `<p style="font-size:11px; color:#999;">No verified photo reviews added yet.</p>`; return; }
    list.forEach(r => {
        let stars = "";
        for(let i=1; i<=5; i++) stars += i <= r.stars ? `★` : `☆`;
        let img = r.photo ? `<img class="review-attached-img" src="${r.photo}">` : "";
        container.innerHTML += `<div class="single-review-card"><div class="review-stars-active">${stars}</div><p style="font-weight:600;">${r.msg}</p>${img}</div>`;
    });
}

function pushToBasket(name, price) { appCartMemory.push({ name: name, price: price }); syncBasketUI(); openCartPanelSheet(); }
// FIXED: Isolated Dropdowns click states to prevent freeze logs
function openCartPanelSheet() { document.getElementById('cartPanelSheet').classList.add('sheet-active'); document.getElementById('sheetOverlay').style.display = "block"; }
function closeCartPanelSheet() { document.getElementById('cartPanelSheet').classList.remove('sheet-active'); document.getElementById('sheetOverlay').style.display = "none"; }

function syncBasketUI() {
    document.getElementById('cartHookCounterText').innerText = `Cart (${appCartMemory.length})`;
    const body = document.getElementById('cartSheetBodyContainer');
    if(appCartMemory.length === 0) { body.innerHTML = "<p style='text-align:center; color:#999; margin-top:35px;'>Basket trace empty.</p>"; document.getElementById('sheetTotalBillHook').innerText="₹0"; return; }
    body.innerHTML = ""; let total = 0;
    appCartMemory.forEach((item, idx) => { total += item.price; body.innerHTML += `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;"><div><h4>${item.name}</h4><b>₹${item.price}</b></div><i class="fa-solid fa-trash" style="color:#ff3e3e; cursor:pointer;" onclick="dropItem(${idx})"></i></div>`; });
    document.getElementById('sheetTotalBillHook').innerText = `₹${total}`;
}
function dropItem(idx) { appCartMemory.splice(idx,1); syncBasketUI(); }
function autoFetchGPSAddress() { alert("📍 GPS Linked!"); }
function executeCloudCheckout() { alert("📦 Tracked Order via Firebase!"); appCartMemory=[]; syncBasketUI(); closeCartPanelSheet(); }
function parseJwt(token) { var base64Url = token.split('.')[1]; var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''))); }
          
