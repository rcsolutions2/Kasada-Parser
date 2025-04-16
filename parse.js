async function fetchIPS() {
    try {
      const resp = await fetch('https://passport.twitch.tv/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/ips.js');
      const ipsjs = await resp.text();
      return ipsjs; 
    } catch (err) {
      console.error('Failed to fetch IPS.js -> ', err);
    }
  }
  
const ipsjs = await fetchIPS(); 
var bytearr = []

var decode = function() {
    const v = ipsjs.split("}return")[1].split('="')[1].split('"')[0];
    const decodeStr = ipsjs.split(v)[1].split('"length",')[1].split('"')[1].split('"')[0];
    const decodeInt = parseInt(ipsjs.split(decodeStr)[1].split(",")[1].split(")")[0]);

    for (let M = 0; M < v.length; )
        for (var addInt = 0, multInt = 1; ; ) {
            var byte = decodeStr.indexOf(v[M++]);
            if (addInt += multInt * (byte % decodeInt),
            byte < decodeInt) {
                bytearr.push(addInt | 0);
                break
            }
            addInt += decodeInt * multInt,
            multInt *= decodeStr.length - decodeInt
        }

    let bytelen = bytearr.length
    let xored = bytearr[bytelen - 1] ^ bytelen + 4
    let bytecode = bytearr.splice(xored, bytearr[xored + 1] + 2);
    let offset = 1
    
    for (var decoded = "", n = bytecode[offset++], O = 0; O < n; O++) {
        let index = bytecode[offset++];
        decoded += String.fromCharCode(index & 4294967232 | index * 41 & 63)
    }
    return decoded
}

var parse = function(length, offset) {
    let data = bytecode.slice(offset, offset + length)
    return data
}

var bytecode = decode()
var instructions = bytearr
var extracted = new Set()
var byte = 0

while (byte < instructions.length) {
    //var curr = byte;
    var length = instructions[byte++];
    var offset = instructions[byte++];
    var parsed = parse(length, offset);
    
    if (parsed.length > 2300 && parsed.length < 2500 && !extracted.has(parsed) && parsed[0] === 'A') {
        console.log(`${parsed}`)
    }
}
