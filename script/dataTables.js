const navElement = document.getElementById("visualizza-elenco-tel-sm")
navElement.addEventListener('click', createContactListDataTable)

let contactListTableInstance = null;

async function createContactListDataTable() {
  console.log("createContactListDataTable() called");

  const url = "http://localhost:8080/employee-contact-list";
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      }
    });

    if (!response.ok) {
      throw new Error(`Errore nel recupero dei dati: ${response.status}`);
    }

    const data = await response.json();

    if (contactListTableInstance) {
      contactListTableInstance.destroy();
      contactListTableInstance = null;
    }

    contactListTableInstance = new DataTable("#contactListTable", {
      data: data,
      destroy: true,
      columns: [
        { data: "nome" },
        { data: "cognome" },
        { data: "email" },
        { data: "telefono" },
        { data: "cellulare" }
      ]
    });

  } catch (error) {
    console.error("Errore nella creazione della tabella:", error.message);
  }
}
