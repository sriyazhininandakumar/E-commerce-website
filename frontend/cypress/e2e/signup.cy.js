describe("Sign Up Page UI Tests", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/signup"); // Adjust URL if needed
    });
  
    it("should load the Sign Up page successfully", () => {
      cy.get("h2").should("have.text", "Sign Up").and("be.visible");
    });
  
    it("should display all form fields", () => {
      cy.get('input[name="name"]').should("be.visible").and("have.attr", "placeholder", "Name");
      cy.get('input[name="email"]').should("be.visible").and("have.attr", "placeholder", "Email");
      cy.get('input[name="password"]').should("be.visible").and("have.attr", "placeholder", "Password");
      cy.get('select[name="roleId"]').should("be.visible");
    });
  
    it("should have a functional role dropdown", () => {
      cy.get('select[name="roleId"]').select("Customer").should("have.value", "2");
      cy.get('select[name="roleId"]').select("Manufacturer").should("have.value", "3");
      cy.get('select[name="roleId"]').select("Admin").should("have.value", "1");
    });
  
    it("should have a sign-up button", () => {
      cy.get("button").contains("Sign Up").should("be.visible").and("be.enabled");
    });
  
    it("should contain a Sign In link", () => {
      cy.contains("Sign In").should("be.visible").click();
      cy.url().should("include", "/"); 
    });
  });
  