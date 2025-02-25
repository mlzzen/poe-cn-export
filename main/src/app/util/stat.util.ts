export class StatUtil {
    public static getBodyOfZhTemplate(template: string): string {
        return this.getNonAsciiOrNonPer(template);
    }

    public static getBodyOfZhModifier(mod: string): string {
        return this.getNonAsciiOrNonPer(mod);
    }

    public static getNonAsciiOrNonPer(str: string): string {
        const buff = new Uint16Array(str.length);
        let size = 0;

        for (let i = 0; i < str.length; i++) {
            //not support ucs2 extended-characters currently
            const char = str.charCodeAt(i);
            if (char == 37 || char >= 256) {
                buff[size++] = char;
            }
        }

        return Buffer.from(buff.subarray(0, size)).toString("utf16le");
    }

    public static render(template: string, zhTemplate: string, zhMod: string): string | null {
        const args = new RegExp(zhTemplate).exec(zhMod);
        if (!args) {
            return null;
        }

        template = template.substring(1, template.length - 1).replace(/\\\+/g, "+");
        const buf = [];
        const pattern = /\(\S+\)/g;
        const len = template.length;
        let lastIndex = 0;
        let argIndex = 0;
        while (lastIndex < len) {
            const matches = pattern.exec(template);
            if (matches) {
                const index = matches.index;
                if (lastIndex !== index) {
                    buf.push(template.substring(lastIndex, index));
                }
                buf.push(args[argIndex + 1]);
                argIndex += 1;
                lastIndex = pattern.lastIndex;
            } else {
                if (lastIndex < len) {
                    buf.push(template.substring(lastIndex, len));
                }
                break;
            }
        }
        if (buf.length > 0) {
            return buf.join("");
        }

        return null;
    }
}