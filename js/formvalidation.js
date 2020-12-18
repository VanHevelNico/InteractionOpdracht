let htmlSignupButton, htmlError, firstname = {}, surname = {}, email = {};

const showError = function(item, errorMsg) {
    item.label.classList.add("has-error");
    item.formfield.classList.add("has-error");
    item.input.classList.add("has-error");
    item.error.innerHTML = errorMsg;
}

const removeError = function(item) {
    item.label.classList.remove("has-error");
    item.formfield.classList.remove("has-error");
    item.input.classList.remove("has-error");
    item.error.innerHTML = "";
}


const validateNames = function(item) {
    if (isEmpty(item.input.value)) {
        showError(item, "Please fill in your name.");
        return false;
    }
    else {
        removeError(item);
        return true;
    }
}

const validateEmail = function() {
    if (isEmpty(email.input.value)) {
        showError(email, "Please fill in your email.")
        return false;
    }
    else if (!isValidEmailAddress(email.input.value)) {
        showError(email, "Please enter a valid email.")
        return false;
    }
    else {
        removeError(email);
        return true;
    }
}

const isValidEmailAddress = function(emailAddress) {
    // Basis manier om e-mailadres te checken.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function(fieldValue) {
    return !fieldValue || !fieldValue.length;
};

const handleFloatingLabel = function(item) {
    item.input.addEventListener("blur", function() {
        if (isEmpty(item.input.value)) {
            item.formfield.classList.remove("is-floating");
        }
        else {
            item.formfield.classList.add("is-floating");
        }
    });
}

const handleValidation = function() {
    // Validate on focus loss
    firstname.input.addEventListener("blur", function() {
        validateNames(firstname);
    });

    surname.input.addEventListener("blur", function() {
        validateNames(surname);
    });

    email.input.addEventListener("blur", function() {
        validateEmail();
    });

}

const init = function() {
    console.log("Document loaded");

    firstname.formfield = document.querySelector(".js-firstname");
    firstname.label = firstname.formfield.querySelector(".js-label");
    firstname.input = firstname.formfield.querySelector(".js-input");
    firstname.error = firstname.formfield.querySelector(".js-error");
    
    surname.formfield = document.querySelector(".js-surname");
    surname.label = surname.formfield.querySelector(".js-label");
    surname.input = surname.formfield.querySelector(".js-input");
    surname.error = surname.formfield.querySelector(".js-error");

    email.formfield = document.querySelector(".js-email");
    email.label = email.formfield.querySelector(".js-label");
    email.input = email.formfield.querySelector(".js-input");
    email.error = email.formfield.querySelector(".js-error");

    htmlSignupButton = document.querySelector(".js-button");

    handleFloatingLabel(firstname);
    handleFloatingLabel(surname);
    handleFloatingLabel(email);

    handleValidation();
}

document.addEventListener("DOMContentLoaded", init);