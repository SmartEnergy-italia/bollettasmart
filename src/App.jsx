import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import BillAnalyzer from './components/BillAnalyzer';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1 mb-4">
        <BillAnalyzer />
      </Container>
      <Footer />
    </div>
  );
}

export default App;