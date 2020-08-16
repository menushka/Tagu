export class QueryUtils {
  static buildBinds = (num: number) => new Array(num).fill('?').join(',');
  static buildWhereBinds = (num: number, column: string) => new Array(num).fill(column + ' LIKE \'%\' || ? || \'%\'').join(' AND ');
}
