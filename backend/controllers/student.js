const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

module.exports.getAll = (req, res) => {
    Student.find({})
        .then(student => {
            return res.status(200).json({
                status: 'ok',
                students: student ? student : [], // Ensure we always at the bare minimum send back an empty array
            });
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};

module.exports.getOne = (req, res) => {
    Student.findById(req.params.id)
        .then(student => {
            return res.status(200).json({
                status: 'ok',
                student: student,
            });
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};

module.exports.create = (req, res) => {
    Teacher.findById(req.body.teacher)
        .then(teacher => {
            if (!teacher) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Could not find teacher',
                });
            }

            new Student({
                student_id: req.body.student_id,
                name: req.body.name,
                teacher: teacher._id,
                deleted:
                    req.body.deleted !== undefined ? req.body.deleted : false,
            })
                .save()
                .then(student => {
                    return res.status(200).json({
                        status: 'ok',
                        student: student,
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: 'error',
                        error: err,
                        message:
                            'An unexpected internal server error has occurred!',
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};

module.exports.update = (req, res) => {
    Student.findById(req.params.id)
        .then(async student => {
            if (!student) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Student not found',
                });
            }

            if (req.body.teacher) {
                const teacher = await Teacher.findById(req.body.teacher);
                if (!teacher) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Unable to find teacher',
                    });
                }
            }

            // Update the student_id if the body request contains a student_id
            student.student_id = req.body.student_id
                ? req.body.student_id
                : student.student_id;

            // Update the name if the body request contains a name
            student.name = req.body.name
            ? req.body.name
            : student.name;

            // Update the student if the body request contains deleted
            student.deleted =
                req.body.deleted !== undefined
                    ? req.body.deleted
                    : student.deleted;

            // Update the unit if the body request contains a unit
            student.teacher = req.body.teacher
                ? req.body.teacher
                : student.teacher;

            const updated = await student.save();

            return res.status(200).json({
                status: 'ok',
                student: updated,
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};

module.exports.deleteOne = (req, res) => {
    Student.findByIdAndRemove(req.params.id)
        .then(student => {
            return res.status(200).json({
                status: 'ok',
            });
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};
