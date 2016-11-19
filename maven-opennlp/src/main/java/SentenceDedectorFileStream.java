/**
 * Dies ist die Dokumentation des SentenceDedectors (FileStream) von OpenNLP.
 * Erkennung und Segmentierung von Sätzen in Text aus Textdatei
 * @author  Tolga Zülfikaroglu
 * @version 0.1
 */
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;

import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;

public class SentenceDedectorFileStream {

    public static void main(final String args[]) throws IOException {
        /**
         * trainiertes Modell laden
         * Modell en-token.bin basiert auf englischer Sprache
         */
        InputStream is = new FileInputStream("models/en-sent.bin");
        SentenceModel model = new SentenceModel(is);
        is.close();

       
        /**
         * Datei auslesen (SentenceDedectorFile.txt)
         */
        StringBuilder sb = new StringBuilder();
        FileReader fr = new FileReader("resources/SentenceDedectorFile.txt");
        BufferedReader br = new BufferedReader(fr);
        char[] buffer = new char[512];
        for (int num = br.read(buffer); num != -1; num = br.read(buffer)) {
            sb.append(buffer, 0, num);
        }
        br.close();
       
       
        /**
         * Sentence Dedector Starten
         * Objekt von der Sentence Dedector Klasse erstellen
         * Segmentierung vom Text in Sätzen und die Ausgabe dieser.
         */
        SentenceDetectorME detector = new SentenceDetectorME(model);
        String sentences[] = detector.sentDetect(sb.toString());
       
        System.out.println(Arrays.toString(sentences));
       
    }
}