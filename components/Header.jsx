import { Navbar, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="white" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="#home">
          <span className="me-2" role="img" aria-label="Document">📄</span>
          <span className="fw-bold">BollettaSmart</span>
        </Navbar.Brand>
        <div className="text-muted d-none d-md-block">Analisi intelligente delle bollette</div>
      </Container>
    </Navbar>
  );
}

export default Header;