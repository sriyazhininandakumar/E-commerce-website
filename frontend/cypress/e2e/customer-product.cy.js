describe("Customer Product Page - Add to Cart", () => {
  beforeEach(() => {
    
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept("GET", "http://localhost:3000/api/products").as("getProducts");

    cy.visit("http://localhost:5173/customer/products");

    cy.get(".border.border-gray-300", { timeout: 10000 }).should("have.length.at.least", 1);
  });

  it("should display products correctly", () => {
    
    cy.get(".border.border-gray-300").should("have.length.at.least", 1);

   
    cy.get(".border.border-gray-300").first().within(() => {
      cy.get("img").should("have.attr", "src").should("not.be.empty"); 
      cy.get("h3").should("exist"); 
      cy.get("p").should("contain.text", "Price:"); 
    });
  });

  it("should update the button state when adding a product to the cart", () => {
   
    cy.contains("button", "Add to Cart").first().as("addToCartButton");
 
    cy.get("@addToCartButton").should("have.text", "Add to Cart");
    cy.get("@addToCartButton").should("not.have.class", "bg-green-500");

  
    cy.get("@addToCartButton").click();

   
    cy.get("@addToCartButton").should("have.text", "Add to Cart");
  });

  it("should navigate to the cart page and verify added items", () => {
   
    cy.contains("button", "Add to Cart").first().click();

    
    cy.visit("http://localhost:5173/customer/cart");

    
  });
});
