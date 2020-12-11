function getFileExtendingName (filename) {
    // 文件扩展名匹配正则
    var reg = /\.[^\.]+$/;
    var matches = reg.exec(filename);
    if (matches) {
      return matches[0];
    }
    return '';
  }
  
  // 示例
  var fName = 'dog.jpg';
  console.log(getFileExtendingName(fName));   // ".jpg"
  