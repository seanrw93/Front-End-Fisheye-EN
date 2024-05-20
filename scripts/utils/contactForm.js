// document.addEventListener('DOMContentLoaded', () => {

    let contactModal = document.querySelector("#contact_modal");
    const form = contactModal.querySelector("form");

    function showModal(modal) {
        document.body.style.overflow = "hidden";
        
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("tabindex", "-1");
        document.querySelector("body > main").style.pointerEvents = "none";
        document.body.style.overflow = "hidden";
        modal.showModal();
    }
    
    function closeModal(modal) {
        document.body.style.overflow = "auto";

        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("aria-modal", "false");
        document.querySelector("body > main").style.pointerEvents = "auto";
        document.body.style.overflow = "auto";
        modal.close();

       form.reset();
    }
    
    const contactButton = document.querySelector(".contact_button");
    console.log(contactButton)
    
    const closeButton = document.querySelector(".close_button");

    contactButton.addEventListener("click", () => showModal(contactModal));

    closeButton.addEventListener("click", () => {
        if (contactModal)
            closeModal(contactModal);
    });    

    class FormData {
        constructor() {
            this.firstName = document.querySelector("#firstName");
            this.lastName = document.querySelector("#lastName");
            this.email = document.querySelector("#email");
            this.message = document.querySelector("#message");
        }

        get getFirstName() {
            return this.firstName.value.charAt(0).toUpperCase() + this.firstName.value.slice(1);
        }

        get getLastName() {
            return this.lastName.value.charAt(0).toUpperCase() + this.lastName.value.slice(1);
        }

        get getEmail() {
            return this.email.value.toLowerCase();
        }

        get getMessage() {
            return this.message.value;
        }

        toJson() {
            return {
                firstName: this.getFirstName,
                lastName: this.getLastName,
                email: this.getEmail,
                message: this.getMessage
            }
        }
    }

    function getFormData() {
        const formData = new FormData();
        return formData.toJson();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(getFormData());
        closeModal(contactModal);
    });

// });