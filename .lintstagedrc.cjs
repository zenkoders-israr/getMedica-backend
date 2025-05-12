module.exports = {
  '**/*.ts': () => 'yarn typecheck',
  '*.{ts,js}': ['yarn lint', 'yarn format'],
  '*.json': ['prettier --write'],
};
