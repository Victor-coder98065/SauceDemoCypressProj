export class InventoryPage {
  inventoryContainer = 'div[data-test="inventory-container"]';
  inventoryProducts = 'div[data-test="inventory-item"]';
  productNames = 'div[data-test="inventory-item-name"]';
  productDescriptions = 'div[data-test="inventory-item-desc"]';
  productImages = 'div[class="inventory_item_img"]';
  productPrices = 'div[data-test="inventory-item-price"]'; 
  menuButton = 'img[data-test="open-menu"]';
  sortDropdown = 'select[data-test="product-sort-container"]';
  backToProductsButton = 'button[data-test="back-to-products"]';
  twitterIcon = 'a[data-test="social-twitter"]';
  facebookIcon = 'a[data-test="social-facebook"]';
  linkedinIcon = 'a[data-test="social-linkedin"]';
}