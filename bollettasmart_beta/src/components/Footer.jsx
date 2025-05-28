import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="py-3 bg-light mt-auto">
      <Container className="text-center text-muted">
        <p className="mb-1">BollettaSmart &copy; {new Date().getFullYear()}</p>
        <p className="small">Powered by AWS Textract</p>
      </Container>
    </footer>
  );
}

export default Footer;