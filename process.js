const { exec } = require("child_process");

exec("sudo ./cloud_sql_proxy -instances=japan-go-explore-348416:asia-southeast1:cloud-group-4=tcp:3306", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});