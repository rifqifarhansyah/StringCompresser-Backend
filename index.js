import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: 'https://main--shimmering-blini-49e6fb.netlify.app' }));

app.post('/api/encode', (req, res) => {
  console.log("1");
  const input = req.body.input;
  console.log("2");
  const outputChoice = req.body.outputChoice;
  console.log("3");
  const encodedOutput = encode(input, outputChoice);
  console.log("4");

  const encodeResult = {
    input: input,
    outputChoice: outputChoice,
    encodedOutput: encodedOutput
  };
  console.log("5");

  const data = JSON.parse(fs.readFileSync("encodeResultsFile.json"));
  console.log("6");
  data.encodeResults.push(encodeResult);
  console.log("7");
  fs.writeFileSync("encodeResultsFile.json", JSON.stringify(data));
  console.log("8");

  res.json({ encodedOutput });
  console.log("9");
});

app.post('/api/decode', (req, res) => {
  const input = req.body.input;
  const inputChoice = req.body.inputChoice;
  const decodedOutput = decode(input, inputChoice);

  const decodeResult = {
    input: input,
    inputChoice: inputChoice,
    decodedOutput: decodedOutput
  };

  const data = JSON.parse(fs.readFileSync("decodeResultsFile.json"));
  data.decodeResults.push(decodeResult);
  fs.writeFileSync("decodeResultsFile.json", JSON.stringify(data));

  res.json({ decodedOutput });
});

app.post('/api/huffmanEncode', (req, res) => {
  const input = req.body.input;
  const outputChoice = req.body.outputChoice;
  const encodedOutput = huffmanEncode(input, outputChoice);

  const encodeResult = {
    input: input,
    outputChoice: outputChoice,
    encodedOutput: encodedOutput
  };

  const data = JSON.parse(fs.readFileSync("encodeResultsFile.json"));
  data.encodeResults.push(encodeResult);
  fs.writeFileSync("encodeResultsFile.json", JSON.stringify(data));

  res.json({ encodedOutput });
});

app.post('/api/huffmanDecode', (req, res) => {
  const input = req.body.input;
  const decodedOutput = huffmanDecode(input);

  const decodeResult = {
    input: input,
    decodedOutput: decodedOutput
  };

  const data = JSON.parse(fs.readFileSync("decodeResultsFile.json"));
  data.decodeResults.push(decodeResult);
  fs.writeFileSync("decodeResultsFile.json", JSON.stringify(data));

  res.json({ decodedOutput });
});

// Fungsi untuk melakukan LZW Encoding
const encode = (inputEncoder, outputChoice) => {
    console.log("Encoding");
    console.log(outputChoice);
    const table = {};
    for (let i = 0; i <= 255; i++) {
        const ch = String.fromCharCode(i);
        table[ch] = i;
    }

    let p = inputEncoder[0];
    let c = "";
    let code = 256;
    const outputCode = [];
    console.log("String\tOutput_Code\tAddition");
    for (let i = 0; i < inputEncoder.length; i++) {
        if (i !== inputEncoder.length - 1)
            c += inputEncoder[i + 1];
        if (table.hasOwnProperty(p + c)) {
            p = p + c;
        } else {
            console.log(p + "\t" + table[p] + "\t\t" + p + c + "\t" + code);
            outputCode.push(table[p]);
            outputCode.push(" ");
            table[p + c] = code;
            code++;
            p = c;
        }
        c = "";
    }
    console.log(p + "\t" + table[p]);
    outputCode.push(table[p]);

    if (outputChoice === "binary") {
        // Mengubah outputCode menjadi format biner
        const binaryOutput = outputCode.map((num) => num.toString(2));
        return binaryOutput;
    } else if (outputChoice === "decimal") {
        // Tidak ada perubahan pada outputCode, langsung dikembalikan
        return outputCode;
    } else {
        console.log("Invalid outputChoice");
        return [];
    }
};


// Fungsi untuk melakukan LZW Decoding
const decode = (inputDecoder, inputChoice) => {
    console.log("\nDecoding");
    console.log(inputChoice);
    const table = {};
    for (let i = 0; i <= 255; i++) {
      const ch = String.fromCharCode(i);
      table[i] = ch;
    }
  
    const inputDecoded = inputDecoder.trim().split(/\s+/); // Menghapus spasi tambahan sebelum memisahkan string
    let old = parseInt(inputDecoded[0], inputChoice === "binary" ? 2 : 10);
    let n;
    let s = table[old];
    let decodedString = s;
    let count = 256;
    for (let i = 0; i < inputDecoded.length - 1; i++) {
      n = parseInt(inputDecoded[i + 1], inputChoice === "binary" ? 2 : 10);
      let entry;
      if (table.hasOwnProperty(n)) {
        entry = table[n];
      } else {
        entry = table[old] + s[0];
      }
      decodedString += entry;
      table[count] = table[old] + entry[0];
      count++;
      old = n;
      s = entry;
    }
    return decodedString;
  };

  const huffmanEncode = (inputEncoder, outputChoice) => {
    console.log("\nHuffman Encoding");
  
    // Fungsi untuk menghitung frekuensi karakter dalam teks
    const getCharacterFrequency = (text) => {
      const frequency = {};
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (frequency[char]) {
          frequency[char]++;
        } else {
          frequency[char] = 1;
        }
      }
      return frequency;
    };
  
    // Simbol Huffman Tree Node
    class Node {
      constructor(char, frequency) {
        this.char = char;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
      }
    }
  
    // Fungsi untuk membangun pohon Huffman Tree
    const buildHuffmanTree = (frequency) => {
      const nodes = [];
      for (const char in frequency) {
        const node = new Node(char, frequency[char]);
        nodes.push(node);
      }
  
      while (nodes.length > 1) {
        nodes.sort((a, b) => a.frequency - b.frequency);
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = new Node(null, left.frequency + right.frequency);
        parent.left = left;
        parent.right = right;
        nodes.push(parent);
      }
  
      return nodes[0];
    };

    const binaryToDecimal = (binary) => {
        return parseInt(binary, 2);
    };
  
    // Fungsi rekursif untuk menghasilkan kode Huffman
    const generateHuffmanCodes = (node, code, codes) => {
      if (node.char) {
        codes[node.char] = code;
      } else {
        generateHuffmanCodes(node.left, code + "0", codes);
        generateHuffmanCodes(node.right, code + "1", codes);
      }
    };
  
    // Fungsi untuk mengonversi teks ke kode Huffman
    const encodeText = (text, codes) => {
      let encodedText = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        encodedText += codes[char] + " ";
      }
      return encodedText.trim();
    };
  
    const frequency = getCharacterFrequency(inputEncoder);
    const huffmanTree = buildHuffmanTree(frequency);
    const huffmanCodes = {};
    generateHuffmanCodes(huffmanTree, "", huffmanCodes);
    if (outputChoice === "decimal") {
        const encodedText = encodeText(inputEncoder, huffmanCodes);
        const encodedTextArray = encodedText.split(" ").map(binaryToDecimal);
        console.log("Encoded Text Array:", encodedTextArray);
      
        const outputData = Object.entries(huffmanCodes)
          .map(([key, value]) => `${key},${binaryToDecimal(value)}`)
          .join("\n");
      
        fs.appendFile("file.txt", outputData + "\n", (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log("Huffman codes exported to", "file.txt");
          }
        });
      
        return encodedTextArray.join(" ");
      }
      
    const encodedText = encodeText(inputEncoder, huffmanCodes);
  
    console.log("Huffman Codes:", huffmanCodes);
    console.log("Encoded Text:", encodedText);
  
    const outputData = Object.entries(huffmanCodes)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');
  
    fs.appendFile("file.txt", outputData + "\n", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Huffman codes exported to", "file.txt");
      }
    });
  
    return encodedText;
  };

  const huffmanDecode = (input) => {
    const huffmanCodes = fs.readFileSync('file.txt', 'utf8');
    const codes = huffmanCodes.split('\n')
      .reduce((obj, code) => {
        const [char, value] = code.split(',');
        obj[value] = char;
        return obj;
      }, {});
    console.log(codes);
  
    const encodedText = input.split(' ')
      .map(code => code.trim())
      .filter(code => code.length > 0);
    console.log(encodedText);
  
    let decodedText = '';
    let currentCode = '';
    for (let i = 0; i < encodedText.length; i++) {
      currentCode += encodedText[i];
      if (codes.hasOwnProperty(currentCode)) {
        decodedText += codes[currentCode];
        currentCode = '';
      }
    }
  
    return decodedText;
  };

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.json('hello world');
  });
  