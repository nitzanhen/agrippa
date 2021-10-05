import { createImport } from 'utils/codegenUtils';

describe('utils/codegenUtils.ts', () => {

  test('createImport', () => {
    expect(createImport('styles.css')).toEqual("import 'styles.css'");
  });


});