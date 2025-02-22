describe('Homepage Test', () => {
    it('should load the homepage correctly', () => {
    
      cy.visit('http://localhost:3000/'); 
  

      cy.title().should('include', 'Sign In');
      cy.get('form').should('be.visible');

      cy.get('button').contains('Sign In').should('be.visible');
    });
  });
  