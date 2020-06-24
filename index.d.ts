/** Takes a string of dirty and badly formatted html and returns a pretty printed valid XHTML string.
 *
 * @param dontFormat    If true, does not add indentation to the output. Default: false.
 * @param catchErrors   If true, catch and suppress all parse errors. Default: false.
 */
export function purify(text: string, dontFormat?: boolean, catchErrors?: boolean): string;
