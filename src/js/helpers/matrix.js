export const calculateMatrixPositiveValues = (matrix = []) =>
  matrix.reduce(
    (row, rowItem) => (
      (row += rowItem.reduce((acc, item) => ((acc += item), acc), 0)), row
    ),
    0
  );
