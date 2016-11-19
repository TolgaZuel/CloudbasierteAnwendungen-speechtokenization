/**
 * Dies ist die Dokumentation des NameFinders von OpenNLP.
 * Erkennung von Personennamen (Entität) im Text
 * @author  Tolga Zülfikaroglu
 * @version 0.1
 */
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import opennlp.tools.namefind.NameFinderME;
import opennlp.tools.namefind.TokenNameFinderModel;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.util.Span;

public class NameFinder{
   
    static String sentence = "Bill Gates is the richest man in the world";

    public static void main(final String args[]) throws IOException {

        InputStream modelInToken = null;
        InputStream modelIn = null;
       
        try {
            /**
             * Segmentierung von Text in Tokens
             * - Erstelle Objekt von der Tokenizer-Klasse mit Nutzung von model
             */
                modelInToken = new FileInputStream("models/en-token.bin");
                TokenizerModel modelToken = new TokenizerModel(modelInToken);
                Tokenizer tokenizer = new TokenizerME(modelToken); 
                String tokens[] = tokenizer.tokenize(sentence);
               
                /**
                 * Suche nach dem Namen=Vorname+Nachnahme im Text (String)
                 */
                modelIn = new FileInputStream("models/en-ner-person.bin");
                TokenNameFinderModel model1 = new TokenNameFinderModel(modelIn);
                NameFinderME Finder1 = new NameFinderME(model1);
               
                Span nameSpans[] = Finder1.find(tokens);
                /**
                 * Wahrscheinlichkeit für Finden der Namen im Text
                 */
                double[] spanProbs = Finder1.probs(nameSpans);
               
                /**
                 * Ausgabe von identifizierten Namen mit Wahrscheinlichkeit
                 */
                for( int i = 0; i<nameSpans.length; i++) {
                    System.out.println("Bereich: "+nameSpans[i].toString());
                    System.out.println("Text beinhaltet den Namen bzw. die Namen: "+tokens[nameSpans[i].getStart()] + " " + tokens[nameSpans[i].getStart()+1]);
                    System.out.println("Wahrscheinlichkeit: "+spanProbs[i]);
                }               
                /**Bereich: [0..2) Personennamen
                 * Text beinhaltet den Namen: Bill Gates
                 * Wahrscheinlichkeit beträgt 0.9525345087861046
                 */
            }
            catch (Exception ex) {}
            finally {
                  try { if (modelInToken != null) modelInToken.close(); } catch (IOException e){};
                  try { if (modelIn != null) modelIn.close(); } catch (IOException e){};
            }
    }
}