/**
 * Dies ist die Dokumentation des Tokernizer von OpenNLP. Segmentierung von Text in Tokens
 * @author  Tolga Zülfikaroglu
 * @version 0.1
 */
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

public class TokenizerTest {

public static void main(final String args[]) throws IOException {      
    /**
     * trainiertes Modell laden
     * Modell en-token.bin basiert auf englischer Sprache
     */
	
	
InputStream is = new FileInputStream("models/en-token.bin");
TokenizerModel model = new TokenizerModel(is);
is.close();

/**
 * Tokenizer Starten
 * Erstelle Objekt von der Tokenizer-Klasse
 * Segmentiert einen String in Tokens
 */
Tokenizer tokenizer = new TokenizerME(model);
String tokens[] = tokenizer.tokenize("Hello my name is Tolga and i study business informattics at the Media University Stuttgart.");

/**
 * Ausgabe der Tokens
 */
System.out.println(Arrays.toString(tokens));

    }

}

