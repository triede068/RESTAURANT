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
    let lieu = document.getElementById("lieu").value;

    if(commande.length === 0 || nom === "" || tel === "" || quartier === "" || lieu === "") {
        alert("Merci de remplir tous les champs et de choisir un plat");
        return;
    }

    let message = `*NOUVELLE COMMANDE CHOPCHOP CI*\n\n`;
    message += `*Nom:* ${nom}\n*Tel:* ${tel}\n*Quartier:* ${quartier}\n*Lieu Publique:* ${lieu}\n\n`;
    message += `Ta commande :\n`;
    commande.forEach(item => {
        message += `- ${item.nom} : ${item.prix} FCFA\n`;
    });
    message += `\n*TOTAL : ${total + parseInt(document.getElementById("livraison").value)} FCFA*`;
    
    let numeroWhatsApp = "2250757560417"; 
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    commande = [];
    total = 0;
    afficherResume();
}
// Fonction pour afficher le choix d'opérateur
function afficherOperateur() {
    let paiement = document.getElementById("paiement").value;
    let box = document.getElementById("operateur-box");
    
    if(paiement === "Mobile Money") {
        box.style.display = "block"; // on montre
    } else {
        box.style.display = "none"; // on cache
        document.getElementById("operateur").value = ""; // on reset
    }
}
let lienPaiement = {
    "Wave": "https://pay.wave.com/m/M_votre_lien_wave", // Mets ton lien Wave Business
    "Orange Money": "https://om.ci/payer/votre_lien_om", // Mets ton lien OM
    "MTN Mobile Money": "https://mtn.ci/payer/votre_lien_mtn",
    "Moov Money": "https://moovmoney.ci/payer/votre_lien_moov"
};

function afficherBoutonPaiement() {
    let operateur = document.getElementById("operateur").value;
    let box = document.getElementById("payer-maintenant");
    let nomOp = document.getElementById("nom-operateur");
    
    if(operateur !== "" && total > 0) {
        box.style.display = "block";
        nomOp.innerText = operateur;
    } else {
        box.style.display = "none";
    }
}

function payerDirect() {
    let operateur = document.getElementById("operateur").value;
    let totalFinal = total + parseInt(document.getElementById("livraison").value);
    
    if(lienPaiement[operateur]) {
        // On ajoute le montant dans le lien. Exemple pour Wave: ?amount=5000
        let urlPaiement = lienPaiement[operateur] + "?amount=" + totalFinal;
        window.open(urlPaiement, '_blank'); // Ouvre la page de paiement
    } else {
        alert("Lien de paiement non configuré pour " + operateur);
    }
}
