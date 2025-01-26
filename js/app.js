import Header from './Components/Header';
import Nonograms from './Components/Nonograms';
import templates from '../data/nonograms/templates.json';

const root = document.querySelector('#root');

const header = new Header(root);
header.generateHeader();

const nonograms = new Nonograms(templates, root);
nonograms.generateGame();
