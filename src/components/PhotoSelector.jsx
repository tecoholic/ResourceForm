import React, {useState, useRef} from 'react';

function PhotoSelector(props) {
  const imageInput = useRef();
  const [image, setImage] = useState({file: null, preview: null});

  const loadImagePreview = () => {
    const reader = new FileReader();
    let file = imageInput.current.files[0];
    props.setFile(file);
    reader.onloadend = () => {
      setImage({
        file: file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="file">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="image_2"
            id="image_2"
            accept="image/*"
            ref={imageInput}
            onChange={loadImagePreview}
          />
          <span className="file-cta">
            <span className="file-label">
              {image.preview ? 'Change photo' : 'Add Photo…'}
            </span>
          </span>
        </label>
      </div>

      {
        image.preview ?
          <figure className="image my">
            <img src={image.preview} alt=""/>
          </figure> :
          <></>
      }


    </div>
  );
}

export default PhotoSelector;