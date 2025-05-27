class InvalidTokenError extends Error {}

async function login(event) {
    event.preventDefault();
    const inputEmail = document.getElementById("email").value
    const inputPasdword = document.getElementById("password").value;

    const url = "http://localhost:8080/auth/login";
    const requestBody = {
        email: inputEmail,
        password: inputPasdword
    }

    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

        chiudiModalErrore(); // Chiude eventuale modale aperta

        if (!response.ok) {
            if (response.status === 401 || response.status === 400) {
                mostraModalErrore();
                return;
            } else {
                mostraModalErrore(`Errore: ${response.status}`);
                return;
            }
        }
        const json = await response.json();

        localStorage.setItem("accessToken", json.accessToken)
        localStorage.setItem("refreshToken", json.refreshToken)

        roleRedirection();
    }
    catch (error) {
        mostraModalErrore("Errore di connessione al server.");
        console.error(error);
    }
}

let modalErroreAperta = false;
let modalErroreKeydownHandler = null;

function mostraModalErrore(testo) {
    const overlay = document.getElementById("modal-errore-overlay");
    const modal = document.getElementById("modal-errore");
    const text = modal.querySelector(".modal-text");
    if (testo) text.textContent = testo;
    overlay.style.display = "flex";
    modalErroreAperta = true;
    // Chiudi la modale solo cliccando sull'overlay, non sulla modale
    overlay.onclick = function(e) {
        if (e.target === overlay) chiudiModalErrore();
    };
    // Blocca input finché la modale è aperta
    modalErroreKeydownHandler = function(e) {
        chiudiModalErrore();
        e.preventDefault();
        e.stopPropagation();
    };
    document.addEventListener("keydown", modalErroreKeydownHandler, true);
    // Disabilita input nei campi
    document.body.classList.add("modal-open");
}

function chiudiModalErrore() {
    const overlay = document.getElementById("modal-errore-overlay");
    overlay.style.display = "none";
    overlay.onclick = null;
    modalErroreAperta = false;
    if (modalErroreKeydownHandler) {
        document.removeEventListener("keydown", modalErroreKeydownHandler, true);
        modalErroreKeydownHandler = null;
    }
    document.body.classList.remove("modal-open");
}

function roleRedirection() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.groups.indexOf("Admin") >= 0) {
            window.location.href = "dashboardAdmin.html";
        }
        else if (decodedToken.groups.indexOf("Requester") >= 0) {
            window.location.href = "dashboardRequester.html";
        }
        else if (decodedToken.groups.indexOf("Reception") >= 0) {
            window.location.href = "dashboardReceptionist.html";
        }
        else {
            window.location.href = "index.html";
        }
    }
};

function b64DecodeUnicode(e) {
    return decodeURIComponent(atob(e).replace(/(.)/g, ((e, r) => {
        let o = r.charCodeAt(0).toString(16).toUpperCase();
        return o.length < 2 && (o = "0" + o),
            "%" + o
    }
    )))
};

function base64UrlDecode(e) {
    let r = e.replace(/-/g, "+").replace(/_/g, "/");
    switch (r.length % 4) {
        case 0:
            break;
        case 2:
            r += "==";
            break;
        case 3:
            r += "=";
            break;
        default:
            throw new Error("base64 string is not of the correct length")
    }
    try {
        return b64DecodeUnicode(r)
    } catch (e) {
        return atob(r)
    }
};

function jwtDecode(e, r) {
    if ("string" != typeof e)
        throw new InvalidTokenError("Invalid token specified: must be a string");
    r || (r = {});
    const o = !0 === r.header ? 0 : 1
        , t = e.split(".")[o];
    if ("string" != typeof t)
        throw new InvalidTokenError(`Invalid token specified: missing part #${o + 1}`);
    let n;
    try {
        n = base64UrlDecode(t)
    } catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${o + 1} (${e.message})`)
    }
    try {
        return JSON.parse(n)
    } catch (e) {
        throw new InvalidTokenError(`Invalid token specified: invalid json for part #${o + 1} (${e.message})`)
    }
};