package com.tfgkyc.kycid.repository;

import org.springframework.data.repository.CrudRepository;

import com.tfgkyc.kycid.model.DocTable;

public interface DocRepository extends CrudRepository<DocTable,Long> {}
