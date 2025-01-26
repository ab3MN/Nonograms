export default function generateResults(results = [], winner) {
  const article = document.createElement('article');
  article.classList.add('results');
  let template = '';
  if (winner)
    template = `<h3 class="own__results">Your Template <span>${winner.template}</span> ! Your Time is <span>${winner.time}</span> </h3>`;

  if (results.length !== 0) template += createScoreTable(results);

  article.innerHTML = template;

  return article;
}

function createScoreTable(score) {
  let _template = ` 
  <h2 class="best__results">TOP SCORE</h3>
  <table class="results__table">
    <tr>
      <th>Template</th> 
      <th>Level</th> 
      <th>Time</th>
    </tr>
`;

  score.forEach(({ template, time, level }) => {
    _template += `
  <tr>
    <td>${template}</td>  
    <td>${level}</td>
    <td>${time}</td>
  </tr>
`;
  });
  _template += `</table>`;
  return _template;
}
