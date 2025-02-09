import './style.css';
import Main from './Main/Main.js';

const main = new Main(document.querySelector('canvas.webgl'));

// Fonction pour vérifier la taille de la fenêtre
function checkWindowSize() {
    const errorScreen = document.getElementById('error-screen');
    if (window.innerWidth < 768) { // Vous pouvez ajuster cette valeur selon vos besoins
        errorScreen.style.display = 'flex'; // Affiche l'écran d'erreur
        document.querySelector('canvas.webgl').style.display = 'none'; // Masque le canvas
    } else {
        errorScreen.style.display = 'none'; // Masque l'écran d'erreur
        document.querySelector('canvas.webgl').style.display = 'block'; // Affiche le canvas
    }
}

// Vérifiez la taille de la fenêtre au chargement
checkWindowSize();

// Ajoutez un écouteur d'événements pour vérifier la taille de la fenêtre lors du redimensionnement
window.addEventListener('resize', checkWindowSize);