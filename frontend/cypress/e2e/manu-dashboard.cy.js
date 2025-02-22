describe("Manufacturer Home Page", () => {
    beforeEach(() => {
      const manufacturerData = { name: "ramasamy" };
      localStorage.setItem("manufacturer", JSON.stringify(manufacturerData));
  
      cy.visit("http://localhost:5173/manufacturer/home");
    });
  
    it("should display the manufacturer name from localStorage", () => {
      cy.contains("Welcome, ramasamy!").should("be.visible");
    });
  
    it("should show loading message when manufacturer data is missing", () => {
      cy.window().then((win) => {
        win.localStorage.removeItem("manufacturer");
      });
  
      cy.reload();
  
      cy.contains("Loading manufacturer data...").should("be.visible");
    });
  });
  