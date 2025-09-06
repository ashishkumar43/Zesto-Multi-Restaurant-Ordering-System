(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);


let count=4;
 function increaseCount(){
    document.getElementById("addtocart").innerHTML=count++;
}

// Cart functionality with dynamic totals
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

function updateCartItem(index, change) {
  let cart = getCart();
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  loadCart();
}

function removeCartItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCart();
}

// Calculate cart totals
function calculateCartTotals() {
  let cart = getCart();
  let subtotal = 0;
  let shippingRate = 3.00; 
  
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  let total = subtotal + shippingRate;
  
  return {
    subtotal: subtotal,
    shipping: shippingRate,
    total: total
  };
}

function updateCartTotals() {
  let totals = calculateCartTotals();
  
  let subtotalElement = document.querySelector('.d-flex.justify-content-between.mb-4 p');
  if (subtotalElement) {
    subtotalElement.textContent = '$' + totals.subtotal.toFixed(2);
  }
  
  // Update total
  let totalElement = document.querySelector('.py-4.mb-4.border-top.border-bottom .mb-0.pe-4');
  if (totalElement) {
    totalElement.textContent = '$' + totals.total.toFixed(2);
  }
  
  let cartCountElement = document.querySelector('.position-absolute.bg-secondary.rounded-circle');
  if (cartCountElement) {
    let cart = getCart();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();

      let container = btn.closest(".fruite-item");
      let product = {
        name: container.querySelector("h4").innerText,
        price: parseFloat(container.querySelector(".fw-bold").innerText.replace("$", "")),
        image: container.querySelector("img").src,
        quantity: 1
      };

      addToCart(product);
      alert(product.name + " added to cart!");
      updateCartTotals(); 
    });
  });

  if (document.getElementById("cart-items")) {
    loadCart();
  }
  
  // Apply coupon functionality
  let applyCouponBtn = document.getElementById("applyCouponbtn");
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", function() {
      let couponInput = document.getElementById("couponInput");
      let couponCode = couponInput.value.trim().toLowerCase();
      
      let coupons = {
        'save10': { discount: 0.10, type: 'percentage' },
        'save5': { discount: 5.00, type: 'fixed' },
        'welcome': { discount: 0.15, type: 'percentage' }
      };
      
      if (couponCode && coupons[couponCode]) {
        applyCoupon(coupons[couponCode]);
        alert('Coupon applied successfully!');
        couponInput.value = '';
      } else if (couponCode) {
        alert('Invalid coupon code!');
      } else {
        alert('Please enter a coupon code!');
      }
    });
  }
});

function applyCoupon(coupon) {
  let cart = getCart();
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  
  if (coupon.type === 'percentage') {
    discount = subtotal * coupon.discount;
  } else {
    discount = coupon.discount;
  }
  
  let subtotalElement = document.querySelector('.d-flex.justify-content-between.mb-4 p');
  let shippingSection = document.querySelector('.d-flex.justify-content-between:not(.mb-4)');

  let existingDiscount = document.querySelector('.discount-row');
  if (existingDiscount) {
    existingDiscount.remove();
  }

  let discountRow = document.createElement('div');
  discountRow.className = 'd-flex justify-content-between mb-4 discount-row';
  discountRow.innerHTML = `
    <h5 class="mb-0 me-4">Discount:</h5>
    <p class="mb-0 text-success">-$${discount.toFixed(2)}</p>
  `;
  
  if (shippingSection) {
    shippingSection.parentNode.insertBefore(discountRow, shippingSection);
  }
  
  // Update total
  let total = subtotal - discount + 3.00; 
  let totalElement = document.querySelector('.py-4.mb-4.border-top.border-bottom .mb-0.pe-4');
  if (totalElement) {
    totalElement.textContent = '$' + total.toFixed(2);
  }
}

function loadCart() {
  let cart = getCart();
  let cartItems = document.getElementById("cart-items");


  cartItems.querySelectorAll("tr.dynamic-row").forEach(row => row.remove());

  cart.forEach((item, index) => {
    let row = document.createElement("tr");
    row.classList.add("dynamic-row");

    row.innerHTML = `
      <th scope="row">
        <div class="d-flex align-items-center">
          <img src="${item.image}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">
        </div>
      </th>
      <td><p class="mb-0 mt-4">${item.name}</p></td>
      <td><p class="mb-0 mt-4">${item.price.toFixed(2)} $</p></td>
      <td>
        <div class="input-group quantity mt-4" style="width: 100px;">
          <button class="btn btn-sm btn-minus rounded-circle bg-light border" data-action="minus" data-index="${index}">
            <i class="fa fa-minus"></i>
          </button>
          <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}" readonly>
          <button class="btn btn-sm btn-plus rounded-circle bg-light border" data-action="plus" data-index="${index}">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </td>
      <td><p class="mb-0 mt-4">${(item.price * item.quantity).toFixed(2)} $</p></td>
      <td>
        <button class="btn btn-md rounded-circle bg-light border mt-4" data-action="remove" data-index="${index}">
          <i class="fa fa-times text-danger"></i>
        </button>
      </td>
    `;
    cartItems.appendChild(row);
  });
  
  // Add event listeners to cart buttons
  cartItems.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      let index = parseInt(btn.getAttribute("data-index"));
      let action = btn.getAttribute("data-action");

      if (action === "plus") updateCartItem(index, 1);
      if (action === "minus") updateCartItem(index, -1);
      if (action === "remove") removeCartItem(index);
    });
  });
  
  updateCartTotals();
}