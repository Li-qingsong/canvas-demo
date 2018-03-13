<?php 
	class File {
		private $file;
		private $name;
		private $type;
		private $size;
		private $tmp_name;
		public $typeCan = array('image/jpeg', 'image/png', 'image/gif', 'image/webm');
		private $tail;
		private $dir;

		public function init($name, $dir = './images') {
			$name && is_string($name) && $this->get_file($name);
			$this->check_type($this->type);
			$this->dir = $this->check_dir($dir);
		}

		private function get_file($name) {
			$file = $this->file = $_FILES[$name];
			is_array($file) && count($file) > 0 && $file['error'] === 0 && $this->get_info($file);
			$file['error'] > 0 && $this->error($file['error']);
		}

		private function get_info($file) {
			$this->name = $file['name'];
			$this->type = $file['type'];
			$this->size = $file['size'];
			$this->tmp_name = $file['tmp_name'];
		}

		private function error($error) {
			throw new Exception($error === 1 ? '文件大小超出php.ini配置的限制! 2M' : ($error === 2 ? '文件超出表单限制的大小! 8M' : ($error === 3 ? '只有部分被上传!' : ($error === 4 ? '没有选择文件!' : ($error === 6 ? '找不到临时目录!' : ($error === 7 ? '文件写入错误!' : '未知错误!'))))), 1);
		}

		private function check_type($type) {
			if (is_string($type) && in_array($type, $this->typeCan)) {
				$this->get_tail($this->name);
			} else {
				throw new Exception('文件类型错误!', 1);
			}
		}

		private function get_tail($name) {
			$arr = explode('.', $name);
			count($arr) > 0 && $this->tail = $arr[1];
		}

		private function check_dir($dir) {
			if (!is_dir($dir)) {
				mkdir($dir, '0777');
			}
			return $dir;
		}

		public function upload() {
			$file = $this->tmp_name;
			$name = $this->get_name($this->tail);
			$dir = $this->dir;
			@preg_match('/\/$/', $dir, $res);
			$filename = $dir.(count($res) > 0 ? $name : '/'.$name);

			if (!move_uploaded_file($file, $filename)) {
				throw new Exception('文件上传失败!', 1);
				return false;
			} else {
				return true;
			}
		}

		private function get_name($name) {
			return time().'.'.$name;
		}
	}

	try {
		$f = new File();
		$f->init('file');
		echo $f->upload() ? '文件上传成功' : '文件上传失败';
	} catch(Exception $e) {
		var_dump($e);
	}
 ?>