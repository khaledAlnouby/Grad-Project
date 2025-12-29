import React, { useState, useEffect, useRef } from 'react';

const TagsInput = ({ selectedTags, tags }) => {
    const [tagList, setTagList] = useState(tags);
    const inputRef = useRef(null);

    useEffect(() => {
        selectedTags(tagList);
    }, [tagList]);

    const addTag = (e) => {
        const value = e.target.value.trim();
        if (e.key === 'Enter' && value && !tagList.includes(value)) {
            setTagList([...tagList, value]);
            e.target.value = '';
        } else if (e.key === 'Enter') {
            e.target.value = '';
        }
    };

    const removeTag = (index) => {
        setTagList(tagList.filter((_, i) => i !== index));
    };

    return (
        <div className="tags-input-wrapper">
            {tagList.map((tag, index) => (
                <span key={index} className="tag">
                    {tag}
                    <a onClick={() => removeTag(index)}>&times;</a>
                </span>
            ))}
            <input
                type="text"
                onKeyUp={addTag}
                placeholder="Press enter to add tags"
                ref={inputRef}
            />
        </div>
    );
};

export default TagsInput;
