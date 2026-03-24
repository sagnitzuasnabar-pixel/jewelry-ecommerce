document.getElementById('open-cart').addEventListener('click', () => {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden'; 
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = ''; 
});