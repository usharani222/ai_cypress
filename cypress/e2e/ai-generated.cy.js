describe('Web Page Elements Testing', () => {
    beforeEach(() => {
        cy.visit('http://development.flint-lab.com:3030/')
    })

    it('Should have email input field', () => {
        cy.get('input[name="email"]')
            .should('be.visible')
            .and('have.attr', 'type', 'email')
            .and('have.attr', 'placeholder', 'Email address')
            .and('have.class', 'border-solid border-[2px] py-[4px] px-[40px] border-[#000] rounded-[20px]')
    })

    it('Should have password input field', () => {
        cy.get('input[name="password"]')
            .should('be.visible')
            .and('have.attr', 'type', 'password')
            .and('have.attr', 'placeholder', 'Password')
            .and('have.class', 'border-solid border-[2px] py-[4px] px-[40px] border-[#000] rounded-[20px]')
    })

    it('Should have login button', () => {
        cy.get('button#login-submit-button')
            .should('be.visible')
            .and('contain', 'Log In')
            .and('have.class', 'bg-[#032C63] rounded-[22px] font-bold text-[20px] text-white py-[8px] w-[100%]')
    })

    it('Should login with valid credentials', () => {
        const email = 'test@example.com'
        const password = 'password123!'

        cy.get('input[name="email"]').type(email)
        cy.get('input[name="password"]').type(password)
        cy.get('button#login-submit-button').click()

        // Add further assertions based on successful login behavior
    })

    it('Should not login with invalid credentials', () => {
        cy.get('input[name="email"]').type('invalidemail')
        cy.get('input[name="password"]').type('wrongpassword')
        cy.get('button#login-submit-button').click()

        // Add further assertions based on failed login behavior
    })
})
