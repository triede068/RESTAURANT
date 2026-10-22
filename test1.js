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

    if(commande.length === 0 || nom === "" || tel === "" || quartier === "") {
        alert("Merci de remplir tous les champs et de choisir un plat");
        return;
    }

    let message = `*NOUVELLE COMMANDE CHOPCHOP CI*\n\n`;
    message += `*Nom:* ${nom}\n*Tel:* ${tel}\n*Quartier:* ${quartier}\n\n`;
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