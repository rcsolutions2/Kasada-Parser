from curl_cffi import requests as rq

class Kasada:
    def __init__(self, ips):
        self.instructions = []
        self.ipsjs = rq.get(ips).text
        self.bytecode = self.decrypt()

    def decrypt(self):
        bytecode = self.ipsjs.split("}return")[1].split('="')[1].split('"')[0]
        decode_str = self.ipsjs.split(bytecode)[1].split('"length",')[1].split('"')[1].split('"')[0]
        decode_int = int(self.ipsjs.split(decode_str)[1].split(",")[1].split(")")[0])

        M = 0
        while M < len(bytecode):
            add_int = 0
            mult_int = 1
            while True:
                byte = decode_str.index(bytecode[M])
                M += 1
                add_int += mult_int * (byte % decode_int)
                
                if byte < decode_int:
                    self.instructions.append(int(add_int))
                    break
                    
                add_int += decode_int * mult_int
                mult_int *= len(decode_str) - decode_int
        
        byte_len = len(self.instructions)
        xored = self.instructions[byte_len - 1] ^ (byte_len + 4)
        bytecode = self.instructions[xored:xored + self.instructions[xored + 1] + 2]
        start = 1
        
        decoded = ""
        n = bytecode[start]
        start += 1
        
        for O in range(n):
            index = bytecode[start]
            start += 1
            decoded += chr(index & 4294967232 | index * 41 & 63)
        
        return decoded
    
    def parse(self, length, start):
        return self.bytecode[start:start + length]
    
    def extract(self):
        byte = 0
        
        while byte < len(self.instructions)-1:
            parsed = self.parse(self.instructions[byte], self.instructions[byte + 1])
            byte += 2
            if len(parsed) > 2000 and parsed[0:2] == 'AA' :
                print(parsed)
                                
ips = 'https://api.nike.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/ips.js'
kasada = Kasada(ips).extract()
