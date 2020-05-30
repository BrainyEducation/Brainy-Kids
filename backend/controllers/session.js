'use strict';
const consts = require('../helpers/consts');
const path = require('path');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');
const PasswordResetModel = require('mongoose').model('PasswordReset');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function hash(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function randomNumberString(length){
    const arr = Array.from(Array(length).keys()).map( x => Math.floor(Math.random() * Math.floor(9)));
    return arr.join('');
}

function randomId() {
    const l = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    return `${l[randomInt(26)]}${l[randomInt(26)]}${l[randomInt(26)]}`;
}

async function generateNewID() {
    let idAlreadyInUse = false;
    do {
        const newId = randomId();
        console.log(newId);
        const teacherSearch = await Teacher.find({teacher_id: newId});
        if( teacherSearch.length > 0) {
            console.log(newId);
            idAlreadyInUse = true;
        } else {
            console.log(newId);
            idAlreadyInUse = false;
            return newId
        }
    }
    while (idAlreadyInUse);
}

function unexpectedError(error, res) {
    console.log(error);
    return res.status(500).json({
        status: 'error',
        error: error,
        message: 'An unexpected internal server error has occurred!',
    });
}

async function createNewTeacher(name, email, passwordHash, res) {
    var id = await generateNewID();

    new Teacher({
        name: name,
        email: email,
        teacher_id: id,
        password: passwordHash,
    })
        .save()
        .then(teacher => {
            // Duplicate created with same id due to race condition
            // Removes and retries after random delay
            if (Teacher.countDocuments({ teacher_id: id }) > 1) {
                Teacher.deleteOne({ email: email });
                return setTimeout(function() {
                    createNewTeacher(name, email, passwordHash, res);
                }, Math.random() * 5);
            } else {
                return Teacher.findOne({ email }).then(teacher => {
                    return res.status(200).json({
                        status: 'ok',
                        teacher,
                        token: jwt.sign(
                            { type: consts.TEACHER, id: teacher._id },
                            process.env.JWT_SECRET
                        ),
                    });
                });
            }
        })
        .catch(error => unexpectedError(error, res));
}

module.exports.newTeacher = (req, res) => {
    Teacher.findOne({ email: req.body.email.toLowerCase() })
        .then(teacher => {
            if (teacher) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Teacher with that email already exists',
                });
            } else {
                return createNewTeacher(
                    req.body.name,
                    req.body.email.toLowerCase(),
                    hash(req.body.password),
                    res
                );
            }
        })
        .catch(error => unexpectedError(error, res));
};

module.exports.login = async (req, res) => {
    const INCORRECT_MESSAGE = 'Your email / password combination is incorrect.';

    if (!req.body.email || !req.body.password) {
        return res.status(403).json({
            status: 'error',
            message: INCORRECT_MESSAGE,
        });
    }

    const teacher = await Teacher.findOne({
        email: req.body.email.toLowerCase(),
    })
        .select('+password')
        .exec()
        .catch(error => unexpectedError(error, res));

    if (!teacher) {
        // We have a random delay to prevent time-attacks
        setTimeout(() => {
            return res.status(403).json({
                status: 'error',
                message: INCORRECT_MESSAGE,
            });
        }, Math.random() * 100);
        return;
    }

    const passwordsEqual = await bcrypt.compare(
        req.body.password,
        teacher.password
    );

    if (!passwordsEqual) {
        return res.status(403).json({
            status: 'error',
            message: INCORRECT_MESSAGE,
        });
    }

    const payload = {
        id: teacher._id,
        type: consts.TEACHER,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

    const cleanTeacher = await Teacher.findById(teacher._id).catch(error =>
        unexpectedError(error, res)
    );

    return res.json({
        status: 'ok',
        token: jwtToken,
        teacher: cleanTeacher,
    });
};

module.exports.loginStudent = async (req, res) => {
    const INCORRECT_MESSAGE = 'Invalid student ID.';

    if (!req.body.id) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required body parameter `id`',
        });
    }

    if (req.body.id.length !== 5) {
        return res.status(400).json({
            status: 'error',
            message: INCORRECT_MESSAGE,
        });
    }

    const teacher = await Teacher.findOne({
        teacher_id: req.body.id.substring(0, 3),
    });

    if (!teacher) {
        // We have a random delay to prevent time-attacks
        setTimeout(() => {
            if (!teacher) {
                return res.status(403).json({
                    status: 'error',
                    message: INCORRECT_MESSAGE,
                });
            }
        }, Math.random() * 100);
        return;
    }

    const student = await Student.findOne({
        teacher: teacher._id,
        student_id: req.body.id.substring(3),
    });

    if (!student) {
        // We have a random delay to prevent time-attacks
        setTimeout(() => {
            return res.status(403).json({
                status: 'error',
                message: INCORRECT_MESSAGE,
            });
        }, Math.random() * 100);
        return;
    }

    const payload = {
        id: student._id,
        type: consts.STUDENT,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({
        status: 'ok',
        token: jwtToken,
        student: student,
    });
};

module.exports.resetPassword = async (req, res) => {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) {
        return res.status(403).json({
            status: 'error',
            message: 'You are not signed in as a Teacher.',
        });
    }

    if (!req.body.password || !req.body.confirm_password) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request.',
        });
    }

    if (req.body.password.length <= 7) {
        return res.status(400).json({
            status: 'error',
            message: 'Unable to change password. New password too short.',
        });
    }

    // const passwordsEqual = await bcrypt.compare(
    //     req.body.password,
    //     req.body.confirm_password
    // );

    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).json({
            status: 'error',
            message:
                'Unable to change password. New password does not match confirm password.',
        });
    }

    teacher.password = hash(req.body.password);
    await teacher.save();

    return res.json({
        status: 'ok',
    });
};

// Function takes teacher email and emails the teacher a link to reset it
module.exports.forgotPasswordPost = async (req, res) => {
    Teacher.findOne({ email: req.body.email.toLowerCase() })
    .then(teacher => {
        if (teacher) {
            // Tag a new Password_Reset model on the teacher model in the DB
            PasswordResetModel.create({expired: false}, 
                function(err, passwordResetModel) {
                    if (err) {
                        unexpectedError(err, res)
                    } else {
                        teacher.password_reset_model = passwordResetModel;
                        teacher.save(err => {
                            if (err) {
                                unexpectedError(error, res)
                            } else {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: process.env.NODEMAILER_EMAIL,
                                        pass: process.env.NODEMAILER_PASSWORD
                                    }
                                });
                                var mailOptions = {
                                    from: process.env.NODEMAILER_EMAIL,
                                    to: teacher.email,
                                    subject: 'Brainy Kids Password Reset',
                                    text: 'You requested ! Follow this link to reset: https://teacherportal.hearatale.com/api/session/forgotpassword?tid=' + teacher._id +'&pid=' + passwordResetModel._id
                                };
                                transporter.sendMail(mailOptions, function(err, info){
                                    if (err) {
                                        unexpectedError(err, res)
                                    } else {
                                        return res.json({
                                            status: 'ok',
                                            message: 'Email was sent to ' + teacher.email,
                                        });
                                    }
                                }); 
                            }
                        });
                    }
            })
            
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'Teacher with that email does not exist',
            });
        }
    })
    .catch(error => unexpectedError(error, res));
}

// Function that reset password email links to
module.exports.forgotPasswordGet = async (req, res) => {

    const NEW_PASSWORD = randomNumberString(24);

    Teacher.findById(req.query.tid)
        .then(teacher => {
            if (teacher) {
                if (teacher.password_reset_model._id == req.query.pid) {
                    teacher.password = hash( NEW_PASSWORD );
                    teacher.password_reset_model = null;
                    teacher.save(err => {
                        if (err) {
                            unexpectedError(error, res)
                        } else {
                            return res.json({
                                status: 'ok',
                                message: 'Your new password is: ' + NEW_PASSWORD,
                            });
                        }
                    });
                } else {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Password IDs do not match',
                    });
                }
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'Could not lookup teacher with that id',
                });
            }
        })
        .catch(error => unexpectedError(error, res));
}


module.exports.getInfo = async (req, res) => {
    return res.status(200).json({
        status: 'ok',
        teacher: await Teacher.findById(req.user._id),
    });
};

module.exports.getStudentInfo = async (req, res) => {
    var toRet = {
        status: 'ok',
        student: await Student.findById(req.user._id),
    };
    return res.status(200).json(toRet);
};
