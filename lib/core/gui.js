'use strict';

module.exports = (mod, guide, lang, dispatch) => {

	// Colors
	const gcr = '#fe6f5e';  // red
	const gcg = '#4de19c';  // green
	const gcy = '#c0b94d';  // yellow
	const gcgr = '#778899'; // gray

	// Hooks for working a commands sended with GUI
	mod.hook("C_CONFIRM_UPDATE_NOTIFICATION", "raw", { order: 100010 }, () => false);
	mod.hook("C_ADMIN", 1, { order: 100010, filter: { fake: null, silenced: false, modified: null } }, (event) => {
		const commands = event.command.split(";");

		for (const cmd of commands) {
			try {
				mod.command.exec(cmd);
			} catch (e) {
				continue;
			}
		}

		return false;
	});

	// Parser functions
	const gui = {
		parse(array, title) {
			let body = "";

			for (const data of array) {
				if (body.length >= 16000) {
					body += "GUI data limit exceeded, some values may be missing.";
					break;
				}

				if (data.command)
					body += `<a href="admincommand:/@${data.command}">${data.text}</a>`;
				else if (!data.command)
					body += `${data.text}`;
				else
					continue;
			}

			mod.toClient("S_ANNOUNCE_UPDATE_NOTIFICATION", 1, { id: 0, title, body });
		}
	}

	// Handler for generate context
	global.guiHandler = (page, title) => {
		let tmpData = [];

		switch (page) {
			default:
				tmpData.push(
					{ text: `<font color="${gcy}" size="+20">${lang.strings.settings}:</font>` }, { text: "&#09;&#09;&#09;" },
					{ text: `<font color="${mod.settings.spawnObject ? gcg : gcr}" size="+18">[${lang.strings.spawnObject}]</font>`, command: "guia spawnObject;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.speaks ? gcg : gcr}" size="+18">[${lang.strings.speaks}]</font>`, command: "guia voice;guia gui" },
					{ text: "<br>&#09;&#09;&#09;&#09;&#09;&#09;" },
					{ text: `<font color="${mod.settings.lNotice ? gcg : gcr}" size="+18">[${lang.strings.lNotice}]</font>`, command: "guia lNotice;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: "<br>&#09;&#09;&#09;&#09;&#09;&#09;" },
					{ text: `<font color="${mod.settings.gNotice ? gcg : gcr}" size="+18">[${lang.strings.gNotice}]</font>`, command: "guia gNotice;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: "<br>&#09;&#09;&#09;&#09;&#09;&#09;" },
					{ text: `<font color="${mod.settings.stream ? gcg : gcr}" size="+18">[${lang.strings.stream}]</font>`, command: "guia stream;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<br><br>` },
					{ text: `<font color="${gcy}" size="+20">${lang.strings.rate}:</font>` }, { text: "&#09;&#09;" },
					{ text: `<font color="${mod.settings.rate[0] == 1 ? gcg : gcr}" size="+18">[1]</font>`, command: "guia 1;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 2 ? gcg : gcr}" size="+18">[2]</font>`, command: "guia 2;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 3 ? gcg : gcr}" size="+18">[3]</font>`, command: "guia 3;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 4 ? gcg : gcr}" size="+18">[4]</font>`, command: "guia 4;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 5 ? gcg : gcr}" size="+18">[5]</font>`, command: "guia 5;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 6 ? gcg : gcr}" size="+18">[6]</font>`, command: "guia 6;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 7 ? gcg : gcr}" size="+18">[7]</font>`, command: "guia 7;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 8 ? gcg : gcr}" size="+18">[8]</font>`, command: "guia 8;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 9 ? gcg : gcr}" size="+18">[9]</font>`, command: "guia 9;guia gui" }, { text: "&nbsp;&nbsp;" },
					{ text: `<font color="${mod.settings.rate[0] == 10 ? gcg : gcr}" size="+18">[10]</font>`, command: "guia 10;guia gui" }, { text: "&nbsp;&nbsp;&nbsp;&nbsp;" },
					{ text: `<font size="+18">[${lang.strings.test}]</font>`, command: "guia guivoicetest" },
					{ text: `<br>` }
				);

				tmpData.push(
					{ text: `<font color="${gcy}" size="+20">${lang.strings.color}:</font>` }, { text: "&#09;&#09;&#09;&#09;" }
				);

				for (const color of ["cr", "co", "cy", "cg", "cv", "cb", "clb", "cdb", "cp", "clp", "cw", "cgr", "cbl"]) {
					let cc = eval(color);

					tmpData.push({ text: `<font color="${mod.settings.cc[0] === cc ? gcg : gcr}" size="+18">[${color.substr(1).toUpperCase()}]</font>`, command: "guia " + color + ";guia gui" }, { text: "&nbsp;&nbsp;" });
				}

				tmpData.push(
					{ text: `<br><br>` },
					{ text: `<font color="${gcy}" size="+20">${lang.strings.dungeons}:</font><br>` }
				);

				for (const [id, dungeon] of Object.entries(mod.settings.dungeons)) {
					if (!dungeon.name) continue;

					tmpData.push({ text: `<font color="${dungeon.spawnObject ? gcg : gcr}" size="+18">[${lang.strings.objects}]</font>`, command: "guia spawnObject " + id + ";guia gui" }, { text: "&nbsp;&nbsp;" });
					tmpData.push({ text: `<font color="${dungeon.verbose ? gcg : gcr}" size="+18">[${lang.strings.verbose}]</font>`, command: "guia verbose " + id + ";guia gui" }, { text: "&nbsp;&#8212;&nbsp;" });
					tmpData.push({ text: `<font color="${gcgr}" size="+20">${dungeon.name}</font>` });
					tmpData.push({ text: "<br>" });
				}

				gui.parse(tmpData, `<font>${title}</font> | <font color="${gcr}" size="+16">${lang.strings.red}</font><font color="${gcgr}" size="+16"> = ${lang.strings.disabled}, <font color="${gcg}" size="+16">${lang.strings.green}</font><font color="${gcgr}" size="+16"> = ${lang.strings.enabled}</font>`)
		}
		tmpData = [];
	};
};