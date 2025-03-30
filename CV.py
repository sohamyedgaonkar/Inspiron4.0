import cv2
from transformers import pipeline
from PIL import Image

# Initialize the emotion recognition pipeline
pipe = pipeline("image-classification", model="prithivMLmods/Facial-Emotion-Detection-SigLIP2")

# Start capturing video from the default camera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Cannot open webcam")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    # if not ret:
    #     print("Failed to grab frame")
    #     break

    # Convert the frame from BGR (OpenCV format) to RGB (PIL format)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Convert to a PIL image
    pil_image = Image.fromarray(rgb_frame)

    # Run emotion recognition on the current frame
    predictions = pipe(pil_image)

    # Extract the top prediction details
    if predictions:
        emotion = predictions[0]['label']
        score = predictions[0]['score']
        #text = f"{emotion}: {score:.2f}"
        print(emotion)
        if(emotion=="Happy"):
            t="Confident"
            print("Good confidence and body language !!!")
        elif(emotion=='Neutral'):
            print("Low confidence need to improve !!!")
            t="less Confident"
        else:
            print("Low enthusiasm be more intercative !!!")
            t="no Confidence"
        text = f"{t}: {score:.2f}"

    else:
        text = "No emotion detected"


    # Overlay the emotion prediction on the original frame
    cv2.putText(frame, text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    # Display the resulting frame
    cv2.imshow("Facial Emotion Recognition - Live Feed", frame)

    # Break the loop on 'q' key press 
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture and destroy windows
cap.release()
cv2.destroyAllWindows()
