let commande = [];
let total = 0;
let platEnAttente = null;

function ajouterPanier(nomPlat, prix) {
    platEnAttente = {nom: nomPlat, prix: prix};
    
    document.getElementById("recapPopup").innerHTML = `
        <p>Ajouter ce plat à votre panier ?</p>
        <h4 style="color:#FF6B00;">${nomPlat}</h4>
        <p><b>${prix} FCFA</b></p> 
    `;
    
    document.getElementById("popupConfirm").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function confirmerAjout() {
    if(platEnAttente) {
        let id = Date.now(); 
        commande.push({id: id, nom: platEnAttente.nom, prix: platEnAttente.prix});
        total += platEnAttente.prix;
        afficherResume();
    }
    fermerPopup();
}

function fermerPopup() {
    document.getElementById("popupConfirm").style.display = "none";
    document.body.style.overflow = "auto";
    platEnAttente = null;
}

function afficherResume() {
    const resumeDiv = document.getElementById("resumeCommande");
    let html = "";
    
    if(commande.length === 0) {
        html = "Aucun plat sélectionné";
    } else {
        commande.forEach(item => {
            html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:8px; background:#f9f9f9; border-radius:5px;">
                <span>${item.nom} : ${item.prix} FCFA</span>
                <i class="fa-solid fa-trash-can" 
                   style="color:#FF3B30; font-size:16px; cursor:pointer;" 
                   onclick="retirerPanier(${item.id}, ${item.prix})">
                </i>
            </div>`;
        });
    }
    resumeDiv.innerHTML = html; 
    calculerTotal();
}

function retirerPanier(id, prix) {
    commande = commande.filter(item => item.id !== id);
    total -= prix;
    afficherResume();
}

function calculerTotal() {
    let fraisLivraison = parseInt(document.getElementById("livraison").value);
    let totalAPayer = total + fraisLivraison;
    document.getElementById("totalAPayer").innerHTML = `<b>Total : ${totalAPayer} FCFA</b>`;
}

function envoyerCommande() {
    let nom = document.getElementById("nom").value;
    let tel = document.getElementById("telephone").value;
    let quartier = document.getElementById("quartier").value;
    let paiement = document.getElementById("paiement").value;
    let operateur = document.getElementById("operateur").value;

    if(commande.length === 0 || nom === "" || tel === "" || quartier === "" || paiement === "") {
        alert("Merci de remplir tous les champs et de choisir un plat");
        return;
    }
    
    if(paiement === "Mobile Money" && operateur === "") {
        alert("Merci de choisir un opérateur Mobile Money");
        return;
    }

    let message = `*NOUVELLE COMMANDE CHOPCHOP CI*\n\n`;
    message += `*Nom:* ${nom}\n`;
    message += `*Tel:* ${tel}\n`;
    message += `*Quartier:* ${quartier}\n`;
    message += `*Paiement:* ${paiement}`;
    
    if(paiement === "Mobile Money") {
        message += ` - ${operateur}\n\n`;
    } else {
        message += `\n\n`;
    }
    
    message += `*COMMANDES:*\n`;
    commande.forEach(item => {
        message += `- ${item.nom} : ${item.prix} FCFA\n`;
    });
    
    let fraisLivraison = parseInt(document.getElementById("livraison").value) || 0;
    let totalFinal = total + fraisLivraison;
    message += `\n*Frais de livraison:* ${fraisLivraison} FCFA`;
    message += `\n*TOTAL : ${totalFinal} FCFA*`;
    
 let numeroWhatsApp = "2250757560417"; 
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
    
    // 1. Ouvre WhatsApp dans un nouvel onglet
    let whatsappWindow = window.open(url, '_blank');

    // 2. AFFICHE LE MESSAGE DE CONFIRMATION
    let conf = document.getElementById("confirmation");
    conf.style.display = "block";
    
    if(paiement === "Espèces à la livraison") {
        conf.innerHTML = `✅ Merci pour votre commande !<br>Paiement en espèces à la livraison. Nous vous appelons bientôt.`;
    } else if(paiement === "Mobile Money") {
        conf.innerHTML = `✅ Merci pour votre commande !<br>Paiement ${operateur} effectué. Nous préparons votre commande.`;
    }

    // 3. APRES 2 SECONDES : Fermer WhatsApp + Actualiser le site
    setTimeout(() => {
        if(whatsappWindow) {
            whatsappWindow.close(); // Ferme l'onglet WhatsApp
        }
        
        // Vider le panier
        commande = [];
        total = 0;
        afficherPanier();
        
        // Actualiser la page
        setTimeout(() => {
    window.location.reload(); // Actualise seulement le site
}, 2000);
}
// 1. Quand on change le mode de paiement
function afficherOperateur() {
    let paiement = document.getElementById("paiement").value;
    let box = document.getElementById("operateur-box");
    let btnPayer = document.getElementById("payer-maintenant");
    
    if(paiement === "Mobile Money") {
        box.style.display = "block"; // montre les opérateurs
    } else {
        box.style.display = "none"; // cache
        btnPayer.style.display = "none"; // cache aussi le bouton
        document.getElementById("operateur").value = "";
    }
}

// 2. Quand on choisit l'opérateur
function afficherBoutonPaiement() {
    let operateur = document.getElementById("operateur").value;
    let box = document.getElementById("payer-maintenant");
    let nomOp = document.getElementById("nom-operateur");
    
    if(operateur !== "" && total > 0) {
        box.style.display = "block"; // AFFICHE LE BOUTON
        nomOp.innerText = operateur;
    } else {
        box.style.display = "none";
    }
}

// 3. Quand on clique pour payer
function payerDirect() {
    let operateur = document.getElementById("operateur").value;
    let fraisLivraison = parseInt(document.getElementById("livraison").value) || 0;
    let totalFinal = total + fraisLivraison;
    
    let lienPaiement = {
        "Wave": "https://pay.wave.com/m/M_TON_LIEN_WAVE", 
        "Orange Money": "https://om.ci/payer/TON_LIEN_OM",
        "MTN Mobile Money": "https://mtn.ci/payer/TON_LIEN_MTN",
        "Moov Money": "https://moovmoney.ci/payer/TON_LIEN_MOOV"
    };
    
    if(lienPaiement[operateur]) {
        let urlPaiement = lienPaiement[operateur] + "?amount=" + totalFinal;
        window.open(urlPaiement, '_blank'); 
    } else {
        alert("Ajoute ton lien de paiement pour " + operateur);
    }
}
