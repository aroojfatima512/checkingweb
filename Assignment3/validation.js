$(document).ready(function () {
  const form = $(".needs-validation");

  // Live validation
  form.find("input, select").on("blur change input", function () {
    validateField($(this));
  });

  // Validation function
  function validateField($field) {
    const id = $field.attr("id");
    let val = $field.val().trim();
    let valid = true;

    // Reset classes
    $field.removeClass("is-valid is-invalid");

    switch (id) {
      case "firstName":
      case "lastName":
        valid = /^[A-Za-z]{3,}$/.test(val); 
        break;

      case "email":
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        break;

      case "phone":
        valid = /^\d{1,9}$/.test(val);
        break;

      case "address":
      case "city":
        valid = val.length > 0;
        break;

      case "postal":
        valid = /^[A-Za-z0-9]{1,6}$/.test(val);
        break;

      case "country":
      case "countryCode":
        valid = val !== "";
        break;
    }

    // Apply feedback classes
    if (valid) {
      $field.addClass("is-valid");
      $field.removeClass("is-invalid");
    } else {
      $field.addClass("is-invalid");
      $field.removeClass("is-valid");
    }

    return valid;
  }

  // Scroll to first invalid
  function scrollToError() {
    const firstInvalid = $(".is-invalid").first();
    if (firstInvalid.length) {
      $("html, body").animate(
        { scrollTop: firstInvalid.offset().top - 100 },
        600
      );
    }
  }

  // On Continue to Payment
  $("#paymentBtn").on("click", function (e) {
    e.preventDefault();
    let allValid = true;

    form.find("input[required], select[required]").each(function () {
      if (!validateField($(this))) {
        allValid = false;
      }
    });

    if (!$("#terms").is(":checked")) {
      alert("Please agree to the terms and conditions before continuing!");
      allValid = false;
    }

    if (!allValid) {
      scrollToError();
      return;
    }

    // Save order
    const orderData = {
      name: $("#firstName").val() + " " + $("#lastName").val(),
      email: $("#email").val(),
      phone: $("#countryCode").val() + " " + $("#phone").val(),
      address:
        $("#address").val() +
        ", " +
        $("#city").val() +
        ", " +
        $("#country").val() +
        " - " +
        $("#postal").val(),
      cart: JSON.parse(localStorage.getItem("cartItems")) || [],
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    window.location.href = "../Assignment2/payment.html";
  });

  // Enable/disable payment button
  $("#terms").on("change", function () {
    $("#paymentBtn").prop("disabled", !$(this).is(":checked"));
  });

  // Prevent entering invalid chars for phone & postal
  $("#phone").on("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 9); // digits only, max 9
  });

  $("#postal").on("input", function () {
    this.value = this.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6); // alphanumeric, max 6
  });

  $("#firstName, #lastName").on("input", function () {
    this.value = this.value.replace(/[^A-Za-z]/g, ""); // letters only
  });
});
