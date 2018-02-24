/* global $, Stripe */
// Document ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro-form');
  var signUpBtn = $('#form-signup-btn');
  
  // Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  // When user clicks form submit btn,
  signUpBtn.click(function(event){
    // prevent default submission behaviour.
    event.preventDefault();
    signUpBtn.val("Proccessing").prop('disabled', true);
    
    // Collect the credit card fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val()
        
    // Use Stripe JS library to check for card errors.
    var error = false;
    
    // Validate card number.
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The Credit Card Number is invalid.')
    }
    
    // Validate CVC number.
    if (!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The CVC Number is invalid.')
    }
    
    // Validate Expiration Date.
    if (!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The Expiration Date is invalid.')
    }
    
    if (error) {
      // If there are card errors, don't send to Stripe.
      signUpBtn.prop('disabled', false).val("Sign Up")
    } 
    else {
      // Send the card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
        
    // Send the card info to Stripe.
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
    
    return false;
    
  });
  
  // Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    // Get the Token from the response.
    var token = response.id;
    
    // Inject card token as hidden field into form.
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    // Submit form to our Rails app. 
    theForm.get(0).submit();
  }
});