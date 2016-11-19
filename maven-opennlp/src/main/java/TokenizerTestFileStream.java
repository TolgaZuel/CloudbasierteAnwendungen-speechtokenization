/**
 * Dies ist die Dokumentation des Tokernizers (FileStream) von OpenNLP. Segmentierung von Text aus Textfile in Tokens
 * @author  Tolga Zülfikaroglu
 * @version 0.1
 */
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;


import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

public class TokenizerTestFileStream {

    public static void main(final String args[]) throws IOException {
        /**
         * trainiertes Modell laden
         * Modell en-token.bin basiert auf englischer Sprache
         */
        InputStream is = new FileInputStream("models/en-token.bin");
        TokenizerModel model = new TokenizerModel(is);
        is.close();

        /**
         * FileReader - Lesen von Strings aus Textdatei
         */
        FileReader fr = new FileReader("resources/TokenizerFile.txt");
        BufferedReader br = new BufferedReader(fr);
       
       
        /**
         * Tokenizer Starten
         * Erstelle Objekt von der Tokenizer-Klasse
         * Segmentiert einen String aus Textfile in Tokens
         * Ausgabe der Tokens
        */
        Tokenizer tokenizer = new TokenizerME(model);
        for (String line = null; (line = br.readLine()) !=null;){
            System.out.println(Arrays.toString(tokenizer.tokenize(line)));
        }
            }

        }

