describe("Manufacturer Profile Page", () => {
    beforeEach(() => {
      localStorage.setItem(
        "manufacturer",
        JSON.stringify({ name: "ramasamy", role: "Manufacturer" })
      );
      localStorage.setItem("token", "test_manufacturer_token");
  
      cy.visit("http://localhost:5173/manufacturer/profile");
    });
  
    it("should display manufacturer details", () => {
      cy.contains("Hi, ramasamy!").should("be.visible");
      cy.contains("Role: Manufacturer").should("be.visible");
    });
  
    it("should sign out and redirect to home", () => {
      cy.get("button").contains("Sign Out").click();
      cy.window().then((win) => {
        expect(win.localStorage.getItem("manufacturer")).to.be.null;
        expect(win.localStorage.getItem("token")).to.be.null;
      });
      cy.url().should("eq", "http://localhost:5173/");
    });
  });
  