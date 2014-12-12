var expect = require('chai').expect;
var XHTMLPurifier = require('./XHTMLPurifier');

describe('XHTMLPurifier', function() {
	// general
	it('works on normal <p>s', function() {
		var html = 'this is a test';
		expect(XHTMLPurifier.purify(html)).to.equal('<p>\n    this is a test\n</p>');
	});
	it('strips html with weird word tags', function() {
		var html = '<ol><li><o:p></o:p><span>Hello, World!</span><o:p>&nbsp;</o:p></li></ol>';
		expect(XHTMLPurifier.purify(html)).to.equal('<ol>\n    <li>\n        Hello, World! \n    </li>\n</ol>');
	});
	it('passes html with bold tags', function() {
		var html = 'Testing <b>some bold</b> and testing';
		expect(XHTMLPurifier.purify(html)).to.equal('<p>\n    Testing <strong>some bold</strong> and testing\n</p>');
	});
	it('passes html with italics tags', function() {
		var html = 'Testing <i>some italics</i> and testing';
		expect(XHTMLPurifier.purify(html)).to.equal('<p>\n    Testing <em>some italics</em> and testing\n</p>');
	});
	it('works on escaped html', function() {
		var html = "&lt;script src=&quot;something&quot;&gt;&lt;/script&gt;";
		expect(XHTMLPurifier.purify(html)).to.equal('<p>\n    &lt;script src=&quot;something&quot;&gt;&lt;/script&gt;\n</p>');
	});

	// tables
	it('works with tables', function() {
		var html = "<table>";
		html += "<caption>Caption</caption>";
		html += "<thead><tr><td>Header</td></tr></thead>";
		html += "<tbody><tr><td>Row</td></tr></tbody>";
		html += "</table>";
		expect(XHTMLPurifier.purify(html).replace(/\s+/g, '')).to.equal(html);
	});
	it('works with empty tables', function() {
		var html = "<table></table> <p>Hola</p>";
		expect(XHTMLPurifier.purify(html)).to.equal("<p>\n    Hola\n</p>");
	});
	it('fixes bad tables', function() {
		var html = "<table>";
		html += "<caption>Caption";
		html += "<thead><th><td>My Header</td></th>";
		html += "<tbody><tr><td>Row</td></tr>";
		html += "</table>";
		//FIXME: Somehow the <tr> in <thead> is followed by two carriage returns 
		var expected = "<table>\n    <caption>\n        Caption\n    </caption>\n";
		expected += "    <thead>\n        <tr>\n            <td>\n                My Header\n            </td>\n        </tr>\n    </thead>\n";
		expected += "    <tbody>\n        <tr>\n            <td>\n                Row\n            </td>\n        </tr>\n    </tbody>\n";
		expected += "</table>";

		expect(XHTMLPurifier.purify(html)).to.equal(expected);
	});
	it('strips table elements outside of tables', function() {
		var html ="Hello <tr><td>World!</tr></td><table>Thingy</table>";
		var expected = "<p>\n    Hello World!\n</p>\n<table>\n    Thingy\n</table>";

		expect(XHTMLPurifier.purify(html)).to.equal(expected);
	});
	it('works with a table with two tbodys and tfoot', function() {
		var html ="<table><tbody><tr><td>Testing</td><tbody><tr><th>Another test</th></tr></tbody><tfoot><tr><td>Testing</td></tr></tfoot>";
		var expected = "<table>\n    <tbody>\n        <tr>\n            <td>\n                Testing\n            </td>\n        </tr>\n    </tbody>\n"+
						"    <tbody>\n        <tr>\n            <th>\n                Another test\n            </th>\n        </tr>\n    </tbody>\n"+
						"    <tfoot>\n        <tr>\n            <td>\n                Testing\n            </td>\n        </tr>\n    </tfoot>\n</table>";
		expect(XHTMLPurifier.purify(html)).to.equal(expected);
	});
});
